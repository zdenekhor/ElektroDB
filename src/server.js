/**
 * ElektroDB – Universal HTTP server (Desktop + Mobile)
 * Spuštění: node src/server.js  (nebo npm start)
 */
import express from 'express';
import path from 'path';
import { spawn } from 'child_process';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import db from './db/database.js';

const PORT = process.env.PORT || 3000;
const app  = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || '';
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS || '';
const AUTH_ENABLED = Boolean(BASIC_AUTH_USER && BASIC_AUTH_PASS);

db.initialize();

function safeEqual(a, b) {
  const aBuf = Buffer.from(a, 'utf8');
  const bBuf = Buffer.from(b, 'utf8');
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm="ElektroDB"');
  return res.status(401).json({ error: 'Vyžadováno přihlášení' });
}

if (AUTH_ENABLED) {
  app.use((req, res, next) => {
    if (req.path === '/health') return next();

    const header = req.headers.authorization || '';
    if (!header.startsWith('Basic ')) return unauthorized(res);

    const encoded = header.slice(6).trim();
    let decoded = '';
    try {
      decoded = Buffer.from(encoded, 'base64').toString('utf8');
    } catch (_err) {
      return unauthorized(res);
    }

    const sep = decoded.indexOf(':');
    if (sep === -1) return unauthorized(res);

    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);

    if (!safeEqual(user, BASIC_AUTH_USER) || !safeEqual(pass, BASIC_AUTH_PASS)) {
      return unauthorized(res);
    }

    return next();
  });
}

// ---------------------------------------------------------------------------
// REST API
// ---------------------------------------------------------------------------

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/stats', (_req, res) => {
  const stats = db.getStats();
  const total = stats.reduce((s, r) => s + r.pocet, 0);
  res.json({ total, breakdown: stats });
});

app.get('/api/groups', (_req, res) => {
  res.json(db.getICSTopGroups());
});

app.get('/api/groups/:code', (req, res) => {
  const code = req.params.code;
  // 2-digit code → return subcategories
  if (/^\d{2}$/.test(code)) {
    const subs = db.getICSSubgroups(code);
    return res.json({ code, subs });
  }
  // longer code → return norms
  const limit  = Math.min(parseInt(req.query.limit) || 50, 200);
  const offset = parseInt(req.query.offset) || 0;
  const data   = db.getNormsByICS(code, limit, offset);
  res.json({ code, limit, offset, ...data });
});

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Zadejte parametr q' });
  if (q.length < 2) return res.status(400).json({ error: 'Heslo musí mít alespoň 2 znaky' });
  const results = db.searchNorms(q);
  res.json({ query: q, count: results.length, results });
});

app.get('/api/norms', (req, res) => {
  const platnost = req.query.platnost?.toUpperCase();
  const limit    = Math.min(parseInt(req.query.limit) || 50, 200);
  const offset   = parseInt(req.query.offset) || 0;
  const total    = db.getNormsCount(platnost || null);
  const results  = db.getNormsPage(limit, offset, platnost || null);
  res.json({
    total,
    limit,
    offset,
    results,
  });
});

app.get('/api/norms/:id', (req, res) => {
  const norm = db.getNormById(parseInt(req.params.id));
  if (!norm) return res.status(404).json({ error: 'Norma nenalezena' });
  const ics = db.getICSForNorm(norm.id);
  res.json({ ...norm, ics });
});

function tableCounts() {
  return {
    norms: db.db.prepare('SELECT COUNT(*) AS n FROM norms').get().n,
    harmonizations: db.db.prepare('SELECT COUNT(*) AS n FROM harmonizations').get().n,
    icsLinks: db.db.prepare('SELECT COUNT(*) AS n FROM ics_links').get().n,
    replacements: db.db.prepare('SELECT COUNT(*) AS n FROM replacements').get().n,
    amendments: db.db.prepare('SELECT COUNT(*) AS n FROM amendments').get().n,
    icsReference: db.db.prepare('SELECT COUNT(*) AS n FROM ics_reference').get().n,
  };
}

function statusCounts(rows) {
  const map = new Map(rows.map(row => [row.platnost, row.pocet]));
  const labels = { A: 'Aktuální', N: 'Neplatná', P: 'Platná', Z: 'Zrušená' };
  return ['A', 'N', 'P', 'Z'].map(code => ({
    code,
    label: labels[code],
    count: map.get(code) || 0,
  }));
}

app.post('/api/update-database', async (_req, res) => {
  const repoRoot = path.join(__dirname, '..');
  const importPath = path.join(repoRoot, 'import.js');
  const env = {
    ...process.env,
    ELEKTRODB_DATA_DIR: process.env.ELEKTRODB_DATA_DIR || path.join(repoRoot, 'data'),
  };

  try {
    const beforeStats = db.getStats();
    const before = {
      total: db.getNormsCount(),
      tables: tableCounts(),
      statuses: statusCounts(beforeStats),
    };

    db.close();
    const code = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [importPath, '--reset'], {
        cwd: repoRoot,
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      child.stdout.on('data', chunk => process.stdout.write(chunk));
      child.stderr.on('data', chunk => process.stderr.write(chunk));
      child.on('error', reject);
      child.on('close', resolve);
    });

    if (code !== 0) {
      throw new Error(`Import skončil s kódem ${code}`);
    }

    db.initialize();
    const afterStats = db.getStats();
    const after = {
      total: db.getNormsCount(),
      tables: tableCounts(),
      statuses: statusCounts(afterStats),
    };

    const changes = {
      totalDelta: after.total - before.total,
      tables: Object.keys(after.tables).map(name => ({
        name,
        before: before.tables[name],
        after: after.tables[name],
        delta: after.tables[name] - before.tables[name],
      })),
      statuses: after.statuses.map(item => ({
        code: item.code,
        label: item.label,
        before: before.statuses.find(row => row.code === item.code)?.count || 0,
        after: item.count,
        delta: item.count - (before.statuses.find(row => row.code === item.code)?.count || 0),
      })),
    };

    res.json({ ok: true, before, after, changes });
  } catch (error) {
    try { db.initialize(); } catch (_e) {}
    res.status(500).json({ error: error.message || 'Nepodařilo se aktualizovat databázi' });
  }
});

// ---------------------------------------------------------------------------
// Static files (frontend)
// ---------------------------------------------------------------------------

app.use(express.static(path.join(__dirname, '../public')));

// Fallback to index.html for SPA
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           ⚡ ELEKTRO DB – Databáze norem ČSN             ║
╚═══════════════════════════════════════════════════════════╝

🌐 Server běží na: http://localhost:${PORT}
📡 API:  http://localhost:${PORT}/api/stats
         http://localhost:${PORT}/api/search?q=elektro
         http://localhost:${PORT}/api/norms?platnost=A

Zastavení: Ctrl+C
`);
});

process.on('SIGINT', () => { db.close(); process.exit(0); });
process.on('SIGTERM', () => { db.close(); process.exit(0); });
