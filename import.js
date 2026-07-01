#!/usr/bin/env node
/**
 * Import dat z DBF souboru Agentury CAS do SQLite databaze ElektroDB.
 * Spusteni: node import.js [--reset]
 *   --reset  smaze existujici data a importuje znovu
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import db from './src/db/database.js';
import {
  readCSN, readHarmonizations, readICSLinks,
  readReplacements, readAmendments, readICSReference,
  collectAll,
} from './src/parsers/dbf-parser.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR   = path.join(__dirname, 'PRELEHLED/csn_data');
const DATA_DIR2  = path.join(__dirname, 'PŘEHLED/csn_data');

function dbfPath(dir, name) {
  return path.join(dir, name);
}

function findDataDir() {
  for (const d of [DATA_DIR2, DATA_DIR]) {
    if (existsSync(d)) return d;
  }
  return null;
}

async function step(label, filePath, readerFn, batchFn) {
  if (!existsSync(filePath)) {
    console.warn('  ⚠  Soubor nenalezen:', filePath);
    return 0;
  }
  process.stdout.write('  ' + label + '... ');
  const rows = await collectAll(readerFn(filePath));
  batchFn(rows);
  console.log(rows.length.toLocaleString('cs') + ' zaznam.');
  return rows.length;
}

async function main() {
  const reset = process.argv.includes('--reset');

  const dataDir = findDataDir();
  if (!dataDir) {
    console.error('Adresar PŘEHLED/csn_data neexistuje.');
    process.exit(1);
  }

  db.initialize();

  if (reset) {
    console.log('Mazem existujici data...');
    db.dropAndRecreate();
  }

  console.log('Importuji z:', dataDir);
  console.log('');

  // Poradi importu je dulezite kvuli FK omezenim
  console.log('[1/6] ICS cisselnik');
  await step('Ics.dbf', dbfPath(dataDir, 'Ics.dbf'), readICSReference, r => db.bulkInsertICSReference(r));

  console.log('[2/6] Normy CSN');
  const normCount = await step('Csn.dbf', dbfPath(dataDir, 'Csn.dbf'), readCSN, r => db.bulkInsertNorms(r));

  console.log('[3/6] Harmonizace');
  await step('Csn_harm.dbf', dbfPath(dataDir, 'Csn_harm.dbf'), readHarmonizations, r => db.bulkInsertHarmonizations(r));

  console.log('[4/6] ICS vazby');
  await step('Csn_ics.dbf', dbfPath(dataDir, 'Csn_ics.dbf'), readICSLinks, r => db.bulkInsertICSLinks(r));

  console.log('[5/6] Nahrazeni');
  await step('Nahrada.dbf', dbfPath(dataDir, 'Nahrada.dbf'), readReplacements, r => db.bulkInsertReplacements(r));

  console.log('[6/6] Zmeny');
  await step('Csn_zm.dbf', dbfPath(dataDir, 'Csn_zm.dbf'), readAmendments, r => db.bulkInsertAmendments(r));

  console.log('');
  console.log('Statistika:');
  db.getStats().forEach(row => {
    const label = { P: 'Platne', Z: 'Zrusene', N: 'Nahrazene', A: 'Avizovane' }[row.platnost] ?? row.platnost;
    console.log('  ' + (row.platnost ?? '?') + '  ' + label.padEnd(12) + row.pocet.toLocaleString('cs'));
  });
  console.log('');

  const sample = db.getAllNorms(5);
  if (sample.length) {
    console.log('Prvnich 5 norem:');
    sample.forEach(n => console.log('  ' + n.identif + ' – ' + (n.nazev ?? '')));
  }

  console.log('');
  console.log('Import dokoncen. Importovano norem: ' + normCount.toLocaleString('cs'));
}

main().catch(err => {
  console.error('Chyba pri importu:', err);
  process.exit(1);
}).finally(() => db.close());
