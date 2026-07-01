#!/usr/bin/env node

/**
 * CLI příkaz pro výpis norem
 * Použití: node src/cli/list.js [platnost]
 *   platnost: P=Platné  Z=Zrušené  N=Nahrazené  A=Avizované
 */
import db from '../db/database.js';

const PLATNOST_LABELS = { A: 'Aktuální', N: 'Neplatná', P: 'Platná', Z: 'Zrušená' };
const MAX_ROWS = 50;

try {
  db.initialize();

  const platnost = process.argv[2]?.toUpperCase();
  const norms = platnost ? db.getNormsByStatus(platnost) : db.getAllNorms();
  const title = platnost ? `Normy [${platnost}] – ${PLATNOST_LABELS[platnost] ?? platnost}` : 'Všechny normy';

  console.log(`\n${title} – celkem: ${norms.length.toLocaleString('cs')}\n`);

  if (norms.length === 0) {
    console.log('Žádné normy nebyly nalezeny.');
  } else {
    console.log('┌──────────────────────────────────────┬────────────────────────────────────────────────────┬──────┬──────────┐');
    console.log('│ Identifikátor                        │ Název                                              │  Pl. │  Vydána  │');
    console.log('├──────────────────────────────────────┼────────────────────────────────────────────────────┼──────┼──────────┤');

    norms.slice(0, MAX_ROWS).forEach(n => {
      const id    = (n.identif  || '').substring(0, 36).padEnd(36);
      const title = (n.nazev    || '').substring(0, 50).padEnd(50);
      const pl    = (n.platnost || '').padEnd(4);
      const date  = (n.vydana   || '').substring(0, 8).padEnd(8);
      console.log(`│ ${id} │ ${title} │ ${pl} │ ${date} │`);
    });

    console.log('└──────────────────────────────────────┴────────────────────────────────────────────────────┴──────┴──────────┘');

    if (norms.length > MAX_ROWS) {
      console.log(`\n... a dalších ${(norms.length - MAX_ROWS).toLocaleString('cs')} norem`);
    }
  }

} catch (error) {
  console.error('❌ Chyba:', error.message);
  process.exit(1);
} finally {
  db.close();
}
