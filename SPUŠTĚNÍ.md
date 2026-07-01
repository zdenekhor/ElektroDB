# 🚀 SPUŠTĚNÍ PROJEKTU

## Rychlý start

### 1. Instalace (Linux/Mac/Windows - PowerShell)

```bash
# Linux / Mac
npm install

# Windows (PowerShell)
npm install
```

**Pokud máte chyby s `better-sqlite3`:**

```bash
# Mac/Linux - nainstalujte build tools
sudo apt-get install build-essential python3

# Pak opět
npm install --build-from-source
```

### 2. Import dat z DBF

```bash
node import.js
```

Očekávaný výstup:
```
🚀 Spouštím import dat...

📋 Krok 1: Import norem ČSN
📂 Načítám: PŘEHLED/csn_data/Csn.dbf
✅ Načteno 2156 záznamů z CSN
✅ Importováno 2145 norem

📋 Krok 2: Import harmonizací
✅ Načteno 1023 harmonizací

📋 Krok 3: Import ICS klasifikací
✅ Načteno 2156 ICS kódů

🎉 Import dokončen!
```

Tím se vytvoří SQLite databáze v `data/elektro-db.sqlite`

### 3. Testování

```bash
# Vyhledávání
node src/cli/search.js "elektro"

# Výpis norem
node src/cli/list.js
node src/cli/list.js active      # Jen aktivní
node src/cli/list.js withdrawn   # Jen zrušené

# Export
node src/cli/export.js json      # Export do JSON
node src/cli/export.js csv       # Export do CSV
```

## npm skripty

```bash
npm run import              # Import dat
npm run search "heslo"      # Vyhledávání
npm run list [status]       # Výpis norem
npm run export json         # Export JSON
npm run dev                 # Watch mode
```

## Přehled příkazů

| Příkaz | Funkce |
|--------|--------|
| `npm run import` | Import DBF → SQLite |
| `npm run search "x"` | Vyhledání norem obsahující "x" |
| `npm run list` | Výpis všech norem |
| `npm run list active` | Jen aktivní normy |
| `npm run export json` | Export do JSON |
| `npm run export csv` | Export do CSV |

## Řešení problémů

### ❌ "better-sqlite3 binding not found"

**Řešení:**
```bash
npm rebuild better-sqlite3
# nebo
npm install --build-from-source
```

### ❌ "Cannot find module 'dbf'"

**Řešení:**
```bash
npm install dbf
```

### ❌ "SQLITE_CANTOPEN"

- Zkontrolujte, že existuje adresář `data/`
- Smazte `data/elektro-db.sqlite` a spusťte `npm run import` znovu

## Struktura databáze

Po importu bude v `data/elektro-db.sqlite`:

```
norms
├── id
├── csn_number (ČSN 33 0000)
├── title
├── status (active, withdrawn, replaced...)
├── ics_code
└── ...

harmonizations
├── csn_id
├── international_norm (ISO 1234)
└── relationship

amendments
├── csn_id
├── amendment_date
└── description
```

## Dalšího vývoj

- [ ] Web rozhraní (React)
- [ ] REST API
- [ ] Full-text search
- [ ] Synchronizace s Agentury ČAS
- [ ] Export do Excel

---

**Pokud se vám projekt líbí, dejte hvězdičku! ⭐**
