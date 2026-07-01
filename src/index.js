/**
 * ElektroDB - Přehledná databáze norem ČSN
 * Hlavní vstupní bod
 */

import db from './db/database.js';

console.log(`
╔═══════════════════════════════════════════════════════════╗
║           🔌 ELEKTRO DB - Databáze norem ČSN             ║
╚═══════════════════════════════════════════════════════════╝
`);

const PLATNOST_LABELS = { A: 'Aktuální', N: 'Neplatná', P: 'Platná', Z: 'Zrušená' };

try {
  db.initialize();

  const stats = db.getStats();
  const total = stats.reduce((s, r) => s + r.pocet, 0);

  if (total === 0) {
    console.log('📭 Databáze je prázdná. Spusťte import:\n   node import.js\n');
  } else {
    console.log(`📊 Celkem norem: ${total.toLocaleString('cs')}\n`);
    stats.forEach(row => {
      const label = PLATNOST_LABELS[row.platnost] ?? row.platnost ?? '?';
      console.log(`   ${(row.platnost ?? '?').padEnd(2)}  ${label.padEnd(12)} ${row.pocet.toLocaleString('cs')}`);
    });
  }

  console.log(`\n📝 Příkazy CLI:`);
  console.log(`   node import.js                     - Import dat (--reset pro přeimport)`);
  console.log(`   node src/cli/search.js "heslo"     - Vyhledávání norem`);
  console.log(`   node src/cli/list.js [platnost]    - Výpis norem (P/Z/N/A)`);
  console.log(`   node src/cli/export.js [json|csv]  - Export norem`);

} catch (error) {
  console.error('❌ Chyba:', error.message);
} finally {
  db.close();
}
