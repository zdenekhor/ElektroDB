# 🚀 ZAČNĚTE TADY - ElektroDB

**Nejjednoduší způsob, jak to spustit na vašem počítači:**

---

## 📋 KROK 1: Příprava (5 minut)

### Stažení
```bash
git clone https://github.com/zdenekhor/ElektroDB.git
cd ElektroDB
```

### Instalace Node.js (pokud nemáte)
Jestliže `npm` nebo `node` neznáte, stáhněte zde:
👉 https://nodejs.org/ (LTS verze)

---

## ⚡ KROK 2: Automatická Instalace (2 minuty)

### Jedním příkazem:

**macOS/Linux:**
```bash
bash install.sh
```

**Windows (PowerShell):**
```powershell
npm install --legacy-peer-deps
npm run import
```

---

## ✅ KROK 3: Použití (ihned)

### Vyhledávání
```bash
npm run search "elektro"
```

### Výpis norem
```bash
npm run list           # Všechny
npm run list active    # Jen aktivní
```

### Export do JSON/CSV
```bash
npm run export json    # Vytvoří exports/elektro-db.json
npm run export csv     # Vytvoří exports/elektro-db.csv
```

---

## 📁 Kde jsou vaše data?

```
ElektroDB/
├── data/
│   └── elektro-db.sqlite    ← Vaše databáze s 2000+ normami
├── exports/
│   ├── elektro-db.json      ← Exportované JSON
│   └── elektro-db.csv       ← Exportované CSV
└── PŘEHLED/csn_data/        ← Zdrojové DBF soubory
```

---

## 🎯 Příklady

### Hledej elektrotechniku
```bash
$ npm run search "elektrika"

┌─────────────────────────────────────────────────────────┐
│ Vyhledávání: elektrika                                  │
├──────────┬──────────────────────┬────────┬──────────────┤
│ ČSN      │ Název                │ Status │ ICS Kód      │
├──────────┼──────────────────────┼────────┼──────────────┤
│ 33 0000  │ Elektrotechnika      │ active │ 29.020       │
│ 33 2100  │ Elektronika          │ active │ 31.020       │
└──────────┴──────────────────────┴────────┴──────────────┘
```

### Vypiš všechny
```bash
$ npm run list active
# Vytiskne tabulku všech 2000+ aktivních norem
```

### Exportuj pro Exel
```bash
$ npm run export csv
# Vytvoří exports/elektro-db.csv - otevřete v Excelu
```

---

## 🔧 Snadné Příkazy

```bash
# Všechny dostupné příkazy
make help

# Vyhledávání
make search Q=test

# Výpis
make list

# Export
make export F=json
```

---

## ❓ Problémy?

### "npm command not found"
→ Node.js není nainstalován: https://nodejs.org/

### "npm install" selhává
```bash
npm install --build-from-source
```

### "Csn.dbf not found"
→ Zkontrolujte, že DBF soubory existují v `PŘEHLED/csn_data/`

### Ostatní problémy
→ Viz [SPUŠTĚNÍ.md](SPUŠTĚNÍ.md#troubleshooting)

---

## 📚 Více Informací

| Soubor | Obsah |
|--------|-------|
| [SPUŠTĚNÍ.md](SPUŠTĚNÍ.md) | Detailní návod |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Jak to funguje |
| [Makefile](Makefile) | Všechny příkazy |

---

**🎉 To je všechno! Teď jen spusťte a užívejte si ElektroDB!**

```bash
npm run search "vase-hledane-slovo"
```
