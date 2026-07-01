# 🔌 ElektroDB - Přehledná databáze norem ČSN

Moderní řešení pro správu a vyhledávání **českých státních norem (ČSN)** s importem z Agentury ČAS.

## ✨ Funkce

- ✅ **Import norem** z DBF souborů Agentury ČAS
- 🔍 **Vyhledávání** norem po klíčových slovech nebo čísle
- 📊 **SQLite databáze** pro rychlé dotazování
- 📤 **Export** do JSON a CSV formátu
- 🎯 **Filtrování** podle statusu (aktivní, zrušená, nahrazená...)
- 🏷️ **ICS klasifikace** a harmonizace s mezinárodními normami

## 📋 Obsah databáze

Původní data z Agentury ČAS obsahují:

- **Csn.dbf** - Hlavní tabulka norem ČSN
- **Csn_harm.dbf** - Harmonizace s normami ISO, EN a dalšími
- **Csn_ics.dbf** - ICS klasifikace norem
- **Csn_pom.dbf** - Pomocná data
- **Csn_zap.dbf** - Zapomenuté a zrušené normy
- **Csn_zm.dbf** - Změny a pozměnění norem

## 🚀 Rychlý start

### 1. Instalace závislostí

```bash
npm install
```

Potřebné balíčky:
- `dbf` - Parser DBF souborů
- `sqlite3` - SQLite databáze
- `better-sqlite3` - Synchronní SQLite rozhraní

### 2. Import dat

```bash
npm run import
```

Tento příkaz:
- Inicializuje SQLite databázi
- Načte data z DBF souborů
- Vytvoří indexy pro rychlé vyhledávání
- Zobrazí statistiku importu

**Výstup:**
```
📂 Načítám: PŘEHLED/csn_data/Csn.dbf
✅ Načteno 2156 záznamů z CSN
✅ Importováno 2145 norem
```

### 3. Vyhledávání

```bash
npm run search "elektro"
```

Zobrazí všechny normy obsahující slovo "elektro":

```
🔍 Vyhledávám: "elektro"

✅ Nalezeno 45 norem:

┌─────────────────┬──────────────────────────────────────────────┬─────────────┐
│ ČSN             │ Název                                        │ Status      │
├─────────────────┼──────────────────────────────────────────────┼─────────────┤
│ ČSN 33 0000     │ Elektrotechnika - všeobecně                 │ active      │
│ ČSN 33 0001     │ Bezpečnost elektrických zařízení            │ active      │
...
```

### 4. Výpis všech norem

```bash
npm run list
```

Výpis norem podle statusu:
```bash
npm run list active       # Aktivní normy
npm run list withdrawn    # Zrušené normy
npm run list replaced     # Nahrazené normy
```

### 5. Export dat

```bash
npm run export json       # Export do JSON
npm run export csv        # Export do CSV
npm run export json active # Export jen aktivních norem
```

## 📊 Databázový model

### Tabulka: `norms`
```sql
- id: INTEGER PRIMARY KEY
- csn_number: TEXT UNIQUE (např. "ČSN 33 0000")
- title: TEXT
- english_title: TEXT
- status: TEXT (active, withdrawn, replaced, amended...)
- adoption_date: TEXT
- publication_date: TEXT
- withdrawal_date: TEXT
- ics_code: TEXT
- scope: TEXT
- org_code: TEXT
```

### Tabulka: `harmonizations`
Vazba na mezinárodní normy (ISO, EN, BS...)

### Tabulka: `ics_codes`
ICS klasifikace (международная классификация стандартов)

### Tabulka: `amendments`
Změny a pozměnění norem

## 🔧 Struktura projektu

```
ElektroDB/
├── package.json              # Definice projektu
├── import.js                 # Import dat z DBF
├── src/
│   ├── index.js              # Hlavní vstupní bod
│   ├── db/
│   │   ├── database.js       # Správce SQLite
│   │   └── schema.js         # Schéma databáze
│   ├── parsers/
│   │   └── dbf-parser.js     # Parser DBF souborů
│   └── cli/
│       ├── search.js         # Vyhledávání
│       ├── list.js           # Výpis norem
│       └── export.js         # Export
├── PŘEHLED/
│   └── csn_data/             # Původní DBF soubory
└── data/
    └── elektro-db.sqlite     # SQLite databáze (vytvořeno po importu)
```

## 💻 API příklady

### Programmatic use

```javascript
import db from './src/db/database.js';

// Inicializovat
db.initialize();

// Hledat normu
const norm = db.findNormByNumber('ČSN 33 0000');

// Vyhledávat
const results = db.searchNorms('elektro');

// Všechny normy
const allNorms = db.getAllNorms();

// Filtrovat dle statusu
const active = db.getNormsByStatus('active');

// Zavřít
db.close();
```

## 📈 Rozšíření

### Plánované funkce
- [ ] Web rozhraní (React/Next.js)
- [ ] REST API
- [ ] Synchronizace s Agentury ČAS
- [ ] Notifikace o změnách norem
- [ ] Porovnání verzí norem
- [ ] Importér projektů (přiřazení norem k projektům)

### Technické vylepšení
- [ ] Full-text search
- [ ] Caching vyhledávání
- [ ] Migrační systém
- [ ] Backup strategie

## 🛠️ Vývoj

### Nastavení dev prostředí

```bash
# Watch mode
npm run dev

# Linting (po přidání ESLint)
npm run lint
```

### Testování

```bash
npm test
```

## 📝 Poznámky

- Databáze je inicializována automaticky při prvním spuštění
- SQLite soubor je uložen v `data/elektro-db.sqlite`
- Staré normy jsou zachovány se statusem `withdrawn`
- Index na `csn_number` zrychluje vyhledávání

## 📄 Licence

MIT

## 👤 Autor

ElektroDB - Databáze českých státních norem

---

**Poslední aktualizace:** 2026-06-30
