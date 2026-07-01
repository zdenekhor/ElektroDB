#!/usr/bin/env node

/**
 * CLI příkaz pro export norem
 * Použití: node src/cli/export.js [json|csv] [platnost]
 */
import db from '../db/database.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

try {
  db.initialize();

  const format   = (process.argv[2] || 'json').toLowerCase();
  const platnost = process.argv[3]?.toUpperCase();

  const norms = platnost ? db.getNormsByStatus(platnost) : db.getAllNorms();

  if (!['json', 'csv'].includes(format)) {
    console.error('Nepodporovaný formát. Použijte: json nebo csv');
    process.exit(1);
  }

  const suffix   = platnost ? `_${platnost}` : '_all';
  const filename = `export${suffix}_${Date.now()}.${format}`;
  const content  = format === 'csv' ? toCSV(norms) : JSON.stringify(norms, null, 2);

  const exportDir = join(process.cwd(), 'exports');
  mkdirSync(exportDir, { recursive: true });
  const filepath = join(exportDir, filename);
  writeFileSync(filepath, content, 'utf8');

  console.log(`Exportováno ${norms.length.toLocaleString('cs')} norem → ${filepath}`);

} catch (error) {
  console.error('❌ Chyba:', error.message);
  process.exit(1);
} finally {
  db.close();
}

function toCSV(norms) {
  const headers = ['ID', 'IDENTIF', 'NAZEV', 'NAZEV_ANG', 'PLATNOST', 'VYDANA', 'DAT_UK', 'SKUPINA'];
  const escape  = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows    = norms.map(n => [
    n.id, escape(n.identif), escape(n.nazev), escape(n.nazev_ang),
    n.platnost ?? '', n.vydana ?? '', n.dat_uk ?? '', n.skupina ?? '',
  ].join(';'));
  return [headers.join(';'), ...rows].join('\n');
}
