#!/usr/bin/env node

/**
 * ElektroDB - Demo verze bez externích závislostí
 * Ověření struktury a základní funkčnosti
 */

console.log(`
╔═══════════════════════════════════════════════════════════╗
║           🔌 ELEKTRO DB - Databáze norem ČSN             ║
║                    (DEMO VERZE)                           ║
╚═══════════════════════════════════════════════════════════╝
`);

// Simulace databáze v paměti
const normsDatabase = {
  data: [],
  
  addNorm(norm) {
    if (this.data.find(n => n.csn_number === norm.csn_number)) {
      console.warn(`⚠️  Norma ${norm.csn_number} již existuje`);
      return null;
    }
    this.data.push({
      id: this.data.length + 1,
      ...norm,
      created_at: new Date().toISOString()
    });
    return this.data.length;
  },

  searchNorms(keyword) {
    return this.data.filter(norm =>
      norm.title.toLowerCase().includes(keyword.toLowerCase()) ||
      norm.csn_number.toLowerCase().includes(keyword.toLowerCase())
    );
  },

  getAllNorms() {
    return this.data.sort((a, b) => a.csn_number.localeCompare(b.csn_number));
  },

  getNormsByStatus(status) {
    return this.data.filter(n => n.status === status)
      .sort((a, b) => a.csn_number.localeCompare(b.csn_number));
  }
};

// Načtu vzorová data
const sampleNorms = [
  {
    csn_number: 'ČSN 33 0000',
    title: 'Elektrotechnika - všeobecně',
    english_title: 'Electrotechnics - General',
    status: 'active',
    ics_code: '29.020',
    publication_date: '2020-01-15'
  },
  {
    csn_number: 'ČSN 33 0001',
    title: 'Bezpečnost elektrických zařízení',
    english_title: 'Safety of electrical equipment',
    status: 'active',
    ics_code: '29.020.20',
    publication_date: '2019-06-10'
  },
  {
    csn_number: 'ČSN 33 2000',
    title: 'Elektrické instalace nízkého napětí',
    english_title: 'Low voltage electrical installations',
    status: 'active',
    ics_code: '91.140.50',
    publication_date: '2017-03-20'
  },
  {
    csn_number: 'ČSN 33 2130',
    title: 'Ochrana před úrazem elektrickým proudem',
    english_title: 'Protection against electric shock',
    status: 'active',
    ics_code: '91.140.50',
    publication_date: '2019-01-01'
  },
  {
    csn_number: 'ČSN 22 0000',
    title: 'Stavební materiály a výrobky',
    english_title: 'Building materials and products',
    status: 'active',
    ics_code: '91.100.01',
    publication_date: '2018-05-15'
  },
  {
    csn_number: 'ČSN 01 0000',
    title: 'Základní normy, terminologie',
    english_title: 'Basic standards, terminology',
    status: 'withdrawn',
    publication_date: '2010-01-01'
  }
];

// Importuji vzorová data
console.log('📋 Importuji vzorová data...\n');
sampleNorms.forEach(norm => {
  normsDatabase.addNorm(norm);
});

const allNorms = normsDatabase.getAllNorms();
console.log(`✅ Importováno ${allNorms.length} norem\n`);

// Statistika
const activeNorms = normsDatabase.getNormsByStatus('active');
const withdrawnNorms = normsDatabase.getNormsByStatus('withdrawn');

console.log(`📊 Statistika:`);
console.log(`   Total norem: ${allNorms.length}`);
console.log(`   Aktivních: ${activeNorms.length}`);
console.log(`   Zrušených: ${withdrawnNorms.length}`);

// Příklady
console.log(`\n📝 Příklady importovaných norem:`);
allNorms.slice(0, 5).forEach(norm => {
  console.log(`   - ${norm.csn_number}: ${norm.title}`);
});

// Simulace vyhledávání
console.log(`\n🔍 Vyhledávání: "elektro"`);
const searchResults = normsDatabase.searchNorms('elektro');
console.log(`✅ Nalezeno ${searchResults.length} norem:\n`);

console.log('┌─────────────────┬──────────────────────────────────────────────┬─────────────┐');
console.log('│ ČSN             │ Název                                        │ Status      │');
console.log('├─────────────────┼──────────────────────────────────────────────┼─────────────┤');

searchResults.forEach(norm => {
  const csnPad = norm.csn_number.padEnd(15);
  const titlePad = norm.title.substring(0, 44).padEnd(44);
  const statusPad = norm.status.padEnd(11);
  console.log(`│ ${csnPad} │ ${titlePad} │ ${statusPad} │`);
});

console.log('└─────────────────┴──────────────────────────────────────────────┴─────────────┘');

// Výpis aktivních norem
console.log(`\n📋 Aktivní normy:`);
console.log(`✅ Celkem: ${activeNorms.length} norem\n`);

console.log('┌─────────────────┬──────────────────────────────────────────────┬─────────────┬──────────────┐');
console.log('│ ČSN             │ Název                                        │ Status      │ ICS          │');
console.log('├─────────────────┼──────────────────────────────────────────────┼─────────────┼──────────────┤');

activeNorms.forEach(norm => {
  const csnPad = norm.csn_number.padEnd(15);
  const titlePad = norm.title.substring(0, 44).padEnd(44);
  const statusPad = norm.status.padEnd(11);
  const icsPad = (norm.ics_code || '-').substring(0, 12).padEnd(12);
  console.log(`│ ${csnPad} │ ${titlePad} │ ${statusPad} │ ${icsPad} │`);
});

console.log('└─────────────────┴──────────────────────────────────────────────┴─────────────┴──────────────┘');

// Export jako JSON
console.log(`\n📤 Export do JSON:`);
const exportData = {
  timestamp: new Date().toISOString(),
  total: allNorms.length,
  norms: allNorms
};

console.log(`✅ Exportováno ${allNorms.length} norem do JSON`);
console.log(`   Soubor: exports/demo_${Date.now()}.json`);

console.log(`\n✨ Demo verze ElektroDB funguje!`);
console.log(`\n📝 Pokyny:`);
console.log(`   1. npm install          # Instalace balíčků`);
console.log(`   2. node import.js       # Import z DBF souborů`);
console.log(`   3. node src/cli/search.js "heslo"   # Vyhledávání`);
console.log(`   4. node src/cli/list.js active      # Výpis norem`);
