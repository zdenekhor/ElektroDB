# 🔌 ElektroDB - Přehledná databáze norem ČSN

Moderní řešení pro správu a vyhledávání **českých státních norem (ČSN)**.

## 🚀 Rychlý start

```bash
# 1. Instalace
npm install

# 2. Import dat z Agentury ČAS
npm run import

# 3. Vyhledávání
npm run search "elektro"

# 4. Výpis norem
npm run list active

# 5. Export
npm run export json
```

**Detailní průvodce:** [SPUŠTĚNÍ.md](SPUŠTĚNÍ.md)

## ✨ Funkce

- ✅ Import norem z DBF (Agentura ČAS)
- 🔍 Vyhledávání po klíčových slovech
- 📊 SQLite databáze
- 📤 Export do JSON/CSV
- 🏷️ ICS klasifikace
- 🌐 Harmonizace s ISO/EN

## 📋 Obsah databáze

- **2000+ českých státních norem** (ČSN)
- Harmonizace s ISO, EN, BS
- ICS klasifikace
- Status norem (aktivní, zrušená, nahrazená...)

## 📖 Dokumentace

- [SPUŠTĚNÍ.md](SPUŠTĚNÍ.md) - Jak spustit projekt
- [DEVELOPMENT.md](DEVELOPMENT.md) - Detailní dokumentace
- [PŘEHLED/](PŘEHLED/) - Původní DBF data od Agentury ČAS

## 🏗️ Architektura

```
ElektroDB/
├── src/
│   ├── db/              # SQLite management
│   │   ├── database.js
│   │   └── schema.js
│   ├── parsers/         # DBF parser
│   │   └── dbf-parser.js
│   └── cli/             # CLI nástroje
│       ├── search.js
│       ├── list.js
│       └── export.js
├── import.js            # Import skript
├── data/                # SQLite DB (po importu)
└── PŘEHLED/csn_data/    # Původní DBF soubory
```

## 💻 Příkazy

```bash
npm run import              # Import dat
npm run search "heslo"      # Vyhledávání
npm run list [status]       # Výpis norem
npm run export json         # Export JSON
npm run dev                 # Dev mode
```

## 📊 Příklad použití

```javascript
import db from './src/db/database.js';

db.initialize();

// Vyhledávání
const results = db.searchNorms('elektro');

// Filtrování
const active = db.getNormsByStatus('active');

// Výpis
db.getAllNorms().forEach(norm => {
  console.log(`${norm.csn_number}: ${norm.title}`);
});

db.close();
```

## 🛠️ Stack

- **Node.js** - Runtime
- **better-sqlite3** - SQLite databáze
- **dbf** - Parser DBF souborů
- **CLI** - Command-line interface

## 📄 Licence

MIT

---

**Podrobnosti:** [DEVELOPMENT.md](DEVELOPMENT.md) | **Spuštění:** [SPUŠTĚNÍ.md](SPUŠTĚNÍ.md)
