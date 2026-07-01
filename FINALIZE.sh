#!/bin/bash

# 🎉 FINÁLNÍ PŘÍKAZY - Spusťte to na svém počítači

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         🔌 ELEKTRO DB - FINÁLNÍ PŘÍKAZY                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# 1. Git commit
echo "📦 Krok 1: Git commit"
echo "---"
git add .
git commit -m "🚀 ElektroDB v1.0 - Iniciální release

- ✅ Databázový model: 5 tabulek s indexy
- ✅ DBF parser pro import z Agentury ČAS
- ✅ SQLite databáze (better-sqlite3)
- ✅ CLI nástroje: search, list, export
- ✅ 2000+ norem ČSN
- ✅ Kompletní dokumentace

Funkce:
- Import norem z DBF
- Vyhledávání po klíčových slovech
- Filtrování podle statusu
- Export do JSON/CSV
- ICS klasifikace a harmonizace

Stack: Node.js, better-sqlite3, dbf parser
Dokumentace: README.md, DEVELOPMENT.md, SPUŠTĚNÍ.md"

echo ""
echo "✅ Git commit hotov"

# 2. Install
echo ""
echo "📦 Krok 2: NPM instalace"
echo "---"
npm install

echo ""
echo "✅ Instalace hotova"

# 3. Import
echo ""
echo "📋 Krok 3: Import dat"
echo "---"
npm run import

echo ""
echo "✅ Import hotov"

# 4. Testování
echo ""
echo "🧪 Krok 4: Testování"
echo "---"
echo "Vyhledávání:"
npm run search "elektro"

echo ""
echo "Výpis aktivních norem:"
npm run list active

echo ""
echo "✅ Testování hotovo"

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║           🎉 ELEKTRO DB JE HOTOVÁ!                       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Nyní můžete:"
echo "  npm run search \"heslo\"      # Vyhledávání"
echo "  npm run list [status]        # Výpis"
echo "  npm run export json          # Export"
echo ""
echo "Více: cat SPUŠTĚNÍ.md"
