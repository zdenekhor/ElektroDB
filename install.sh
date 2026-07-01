#!/bin/bash

# 🚀 ELEKTRO DB - INSTALACE A SPUŠTĚNÍ

clear

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        🚀 ElektroDB - Rychlá Instalace                        ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Kontrol Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js není nainstalován! https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version)"
echo "✅ npm $(npm --version)"
echo ""

# Instalace
echo "📦 Instaluji (tento krok trvá 2-3 minuty)..."
npm install --legacy-peer-deps || npm install --build-from-source

echo ""
echo "📋 Importuji data (trvá 1-2 minuty)..."
npm run import

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   ✅ HOTOVO!                                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Teď spusťte:"
echo "  npm run search \"elektro\""
echo "  npm run list"
echo "  npm run export json"
echo ""
