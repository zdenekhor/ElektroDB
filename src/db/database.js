/**
 * Správce databáze SQLite
 */
import Database from 'better-sqlite3';
import { schema } from './schema.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.ELEKTRODB_DATA_DIR || join(__dirname, '../../data');
const DB_PATH = join(DATA_DIR, 'elektro-db.sqlite');

mkdirSync(DATA_DIR, { recursive: true });

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  initialize() {
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');

    this.db.exec(schema.norms);
    this.db.exec(schema.harmonizations);
    this.db.exec(schema.ics_links);
    this.db.exec(schema.replacements);
    this.db.exec(schema.amendments);
    this.db.exec(schema.ics_reference);
    schema.indexes.forEach(idx => this.db.exec(idx));

    console.log(`✅ Databáze inicializována: ${DB_PATH}`);
    return this;
  }

  // ---------------------------------------------------------------------------
  // Norms
  // ---------------------------------------------------------------------------

  bulkInsertNorms(records) {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO norms
        (id, identif, stupen, znak, cast, podcast, poradi,
         nazev, nazev_ang, platnost,
         schvalena, ucinnost, vydana, dat_uk,
         vestnik, vestnik_z,
         skupina, katalog, strany, format,
         anotace, klice)
      VALUES
        (@id, @identif, @stupen, @znak, @cast, @podcast, @poradi,
         @nazev, @nazev_ang, @platnost,
         @schvalena, @ucinnost, @vydana, @dat_uk,
         @vestnik, @vestnik_z,
         @skupina, @katalog, @strany, @format,
         @anotace, @klice)
    `);
    const insert = this.db.transaction(rows => {
      let n = 0;
      for (const row of rows) n += stmt.run(row).changes;
      return n;
    });
    return insert(records);
  }

  // ---------------------------------------------------------------------------
  // Harmonizations
  // ---------------------------------------------------------------------------

  bulkInsertHarmonizations(records) {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO harmonizations (veta, veta_zn, typ, c_harm, platnost)
      VALUES (@veta, @veta_zn, @typ, @c_harm, @platnost)
    `);
    this.db.transaction(rows => { for (const r of rows) stmt.run(r); })(records);
  }

  // ---------------------------------------------------------------------------
  // ICS links
  // ---------------------------------------------------------------------------

  bulkInsertICSLinks(records) {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO ics_links (veta, ics, platnost)
      VALUES (@veta, @ics, @platnost)
    `);
    this.db.transaction(rows => { for (const r of rows) stmt.run(r); })(records);
  }

  // ---------------------------------------------------------------------------
  // Replacements
  // ---------------------------------------------------------------------------

  bulkInsertReplacements(records) {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO replacements (veta, veta_n, veta_zm)
      VALUES (@veta, @veta_n, @veta_zm)
    `);
    this.db.transaction(rows => { for (const r of rows) stmt.run(r); })(records);
  }

  // ---------------------------------------------------------------------------
  // Amendments
  // ---------------------------------------------------------------------------

  bulkInsertAmendments(records) {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO amendments (veta, veta_zm, platnost, oznaceni, typ, ucinnost, vydana, dat_uk)
      VALUES (@veta, @veta_zm, @platnost, @oznaceni, @typ, @ucinnost, @vydana, @dat_uk)
    `);
    this.db.transaction(rows => { for (const r of rows) stmt.run(r); })(records);
  }

  // ---------------------------------------------------------------------------
  // ICS reference
  // ---------------------------------------------------------------------------

  bulkInsertICSReference(records) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO ics_reference (ics, nazev, nazev_ang)
      VALUES (@ics, @nazev, @nazev_ang)
    `);
    this.db.transaction(rows => { for (const r of rows) stmt.run(r); })(records);
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  searchNorms(keyword) {
    return this.db.prepare(`
      SELECT * FROM norms
      WHERE identif LIKE @kw OR nazev LIKE @kw OR nazev_ang LIKE @kw
      ORDER BY identif
      LIMIT 100
    `).all({ kw: `%${keyword}%` });
  }

  getAllNorms(limit = 0) {
    const sql = 'SELECT * FROM norms ORDER BY identif' + (limit ? ' LIMIT ' + limit : '');
    return this.db.prepare(sql).all();
  }

  getNormsCount(platnost = null) {
    if (platnost) {
      return this.db.prepare('SELECT COUNT(*) AS n FROM norms WHERE platnost = ?').get(platnost).n;
    }
    return this.db.prepare('SELECT COUNT(*) AS n FROM norms').get().n;
  }

  getNormsPage(limit = 50, offset = 0, platnost = null) {
    if (platnost) {
      return this.db.prepare(
        'SELECT * FROM norms WHERE platnost = ? ORDER BY identif LIMIT ? OFFSET ?'
      ).all(platnost, limit, offset);
    }
    return this.db.prepare(
      'SELECT * FROM norms ORDER BY identif LIMIT ? OFFSET ?'
    ).all(limit, offset);
  }

  getNormsByStatus(platnost) {
    return this.db.prepare(
      'SELECT * FROM norms WHERE platnost = ? ORDER BY identif'
    ).all(platnost);
  }

  getStats() {
    return this.db.prepare(`
      SELECT platnost, COUNT(*) AS pocet
      FROM norms
      GROUP BY platnost
      ORDER BY pocet DESC
    `).all();
  }

  getICSTopGroups() {
    return this.db.prepare(`
      SELECT
        ir.ics,
        ir.nazev,
        COUNT(DISTINCT il.veta) AS pocet
      FROM ics_reference ir
      JOIN ics_links il ON il.ics LIKE ir.ics || '.%' OR il.ics = ir.ics
      WHERE LENGTH(ir.ics) = 2
      GROUP BY ir.ics
      ORDER BY ir.ics
    `).all();
  }

  getICSSubgroups(topCode) {
    const prefix = topCode.replace(/'/g, '');
    return this.db.prepare(`
      SELECT
        ir.ics,
        ir.nazev,
        COUNT(DISTINCT il.veta) AS pocet
      FROM ics_reference ir
      JOIN ics_links il ON il.ics LIKE ir.ics || '.%' OR il.ics = ir.ics
      WHERE ir.ics LIKE ? AND LENGTH(ir.ics) = 6
      GROUP BY ir.ics
      ORDER BY ir.ics
    `).all(prefix + '.%');
  }

  getNormsByICS(icsPrefix, limit = 100, offset = 0) {
    const safe = icsPrefix.replace(/'/g, '');
    const total = this.db.prepare(`
      SELECT COUNT(DISTINCT n.id) AS n
      FROM norms n
      JOIN ics_links il ON il.veta = n.id
      WHERE il.ics LIKE ?
    `).get(safe + '%').n;
    const results = this.db.prepare(`
      SELECT DISTINCT n.*
      FROM norms n
      JOIN ics_links il ON il.veta = n.id
      WHERE il.ics LIKE ?
      ORDER BY n.identif
      LIMIT ? OFFSET ?
    `).all(safe + '%', limit, offset);
    return { total, results };
  }



  getICSForNorm(veta) {
    return this.db.prepare(
      'SELECT il.ics, ir.nazev FROM ics_links il LEFT JOIN ics_reference ir ON il.ics = ir.ics WHERE il.veta = ?'
    ).all(veta);
  }

  getNormById(id) {
    return this.db.prepare('SELECT * FROM norms WHERE id = ?').get(id);
  }

  getNormSnapshot() {
    return this.db.prepare('SELECT * FROM norms ORDER BY id').all();
  }

  // ---------------------------------------------------------------------------
  // Utils
  // ---------------------------------------------------------------------------

  dropAndRecreate() {
    ['amendments', 'replacements', 'ics_links', 'harmonizations', 'ics_reference', 'norms']
      .forEach(t => this.db.exec(`DROP TABLE IF EXISTS ${t}`));
    this.initialize();
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export default new DatabaseManager();
