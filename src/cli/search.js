#!/usr/bin/env node

/**
 * CLI příkaz pro vyhledávání norem
 * Použití: node src/cli/search.js "heslo"
 */
import db from '../db/database.js';

const keyword = process.argv[2];
if (!keyword) {
  console.log('Použití: node src/cli/search.js "heslo"');
  process.exit(1);
}

try {
  db.initialize();

  const results = db.searchNorms(keyword);

  if (results.length === 0) {
    console.log(`Žádné normy nebyly nalezeny pro: "${keyword}"`);
  } else {
    console.log(`Nalezeno ${results.length} norem pro: "${keyword}"\n`);
    console.log('┌──────────────────────────────────────┬────────────────────────────────────────────────────┬──────┐');
    console.log('│ Identifikátor                        │ Název                                              │  Pl. │');
    console.log('├──────────────────────────────────────┼────────────────────────────────────────────────────┼──────┤');
    results.forEach(n => {
      const id    = (n.identif  || '').substring(0, 36).padEnd(36);
      const title = (n.nazev    || '').substring(0, 50).padEnd(50);
      const pl    = (n.platnost || '').padEnd(4);
      console.log(`│ ${id} │ ${title} │ ${pl} │`);
    });
    console.log('└──────────────────────────────────────┴────────────────────────────────────────────────────┴──────┘');
  }

} catch (error) {
  console.error('❌ Chyba:', error.message);
  process.exit(1);
} finally {
  db.close();
}
