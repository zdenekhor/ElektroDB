#!/bin/bash

# ElektroDB - Setup script

echo "
╔═══════════════════════════════════════════════════════════╗
║           🔌 ELEKTRO DB - Instalace                      ║
╚═══════════════════════════════════════════════════════════╝
"

# Kontrola Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js není nainstalován"
    echo "Instalujte Node.js z: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js verze: $(node --version)"
echo "✅ npm verze: $(npm --version)"

# Instalace závislostí
echo ""
echo "📦 Instaluji npm balíčky..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Instalace selhala"
    exit 1
fi

echo ""
echo "✅ Instalace hotova!"

# Spuštění importu
echo ""
echo "📋 Spouštím import dat..."
node import.js

echo ""
echo "🎉 Setup hotov!"
echo ""
echo "Nyní můžete spustit:"
echo "  npm run search \"heslo\"      # Vyhledávání norem"
echo "  npm run list active           # Výpis aktivních norem"
echo "  npm run export json           # Export dat"
