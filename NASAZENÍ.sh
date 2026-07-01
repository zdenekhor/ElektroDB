#!/bin/bash

# 🚀 DEPLOYMENT GUIDE - ElektroDB
# Spusťte tyto příkazy na vašem počítači

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         🚀 NASAZENÍ ELEKTRO DB - DEPLOYMENT GUIDE         ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# ============================================================
# KROK 1: Klonování z GitHub
# ============================================================

echo "📥 KROK 1: Klonování z GitHub"
echo "---"
echo "Spusťte:"
echo "  git clone https://github.com/zdenekhor/ElektroDB.git"
echo "  cd ElektroDB"
echo ""

# ============================================================
# KROK 2: Instalace závislostí
# ============================================================

echo "📦 KROK 2: Instalace"
echo "---"
echo "Spusťte:"
echo "  npm install"
echo ""
echo "Jestliže máte problémy s better-sqlite3:"
echo "  npm install --build-from-source"
echo ""

# ============================================================
# KROK 3: Import dat
# ============================================================

echo "📋 KROK 3: Import dat z DBF"
echo "---"
echo "Spusťte:"
echo "  npm run import"
echo ""
echo "Výstup:"
echo "  🚀 Spouštím import dat..."
echo "  📋 Krok 1: Import norem ČSN"
echo "  ✅ Importováno 2145 norem"
echo "  📋 Krok 2: Import harmonizací"
echo "  ✅ Načteno 1023 harmonizací"
echo "  🎉 Import dokončen!"
echo ""

# ============================================================
# KROK 4: Testování
# ============================================================

echo "🧪 KROK 4: Testování"
echo "---"
echo "Spusťte:"
echo "  npm run search \"elektro\""
echo "  npm run list active"
echo "  npm run export json"
echo ""

# ============================================================
# KROK 5: Nasazení do produkcce
# ============================================================

echo "🚀 KROK 5: Produkční nasazení"
echo "---"
echo ""
echo "A) Lokální server:"
echo "  node src/index.js"
echo ""
echo "B) Docker:"
echo "  docker build -t elektro-db ."
echo "  docker run -p 3000:3000 elektro-db"
echo ""
echo "C) Heroku:"
echo "  heroku create elektro-db"
echo "  git push heroku main"
echo ""
echo "D) AWS/DigitalOcean:"
echo "  npm run build"
echo "  # Deploy build/ složku"
echo ""

# ============================================================
# Finální instrukce
# ============================================================

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║           🎉 NASAZENÍ JE HOTOVO!                          ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Příkazy:"
echo "  npm run import              # Import dat"
echo "  npm run search \"heslo\"      # Vyhledávání"
echo "  npm run list [status]       # Výpis"
echo "  npm run export json         # Export"
echo ""
echo "Dokumentace:"
echo "  README.md      - Přehled"
echo "  SPUŠTĚNÍ.md    - Detailní instrukce"
echo "  DEVELOPMENT.md - Technické detaily"
echo ""
