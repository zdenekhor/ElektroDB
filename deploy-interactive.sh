#!/usr/bin/env bash

# 🚀 ELEKTRO DB - DEPLOYMENT QUICK START
# Zkopírujte tyto příkazy a spusťte na vašem počítači

clear

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        🚀 ELEKTRO DB - NASAZENÍ (DEPLOYMENT GUIDE)            ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================
# VOLBA NASAZENÍ
# ============================================================

echo "Vyberte způsob nasazení:"
echo ""
echo "  1️⃣  Lokální (Local Development)"
echo "  2️⃣  Docker (Containerized)"
echo "  3️⃣  Heroku (PaaS)"
echo "  4️⃣  AWS EC2 (Cloud VPS)"
echo "  5️⃣  VPS (DigitalOcean/Hetzner)"
echo ""

read -p "Zadejte číslo (1-5): " choice

case $choice in
  1)
    echo ""
    echo "📋 LOKÁLNÍ NASAZENÍ"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "1️⃣  Klonujte repozitář:"
    echo "  $ git clone https://github.com/zdenekhor/ElektroDB.git"
    echo "  $ cd ElektroDB"
    echo ""
    echo "2️⃣  Instalujte závislosti:"
    echo "  $ npm install"
    echo ""
    echo "3️⃣  Importujte data:"
    echo "  $ npm run import"
    echo ""
    echo "4️⃣  Spusťte aplikaci:"
    echo "  $ node src/index.js"
    echo ""
    echo "5️⃣  Testujte:"
    echo "  $ npm run search \"elektro\""
    echo "  $ npm run list active"
    echo ""
    ;;

  2)
    echo ""
    echo "🐳 DOCKER NASAZENÍ"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "1️⃣  Klonujte repozitář:"
    echo "  $ git clone https://github.com/zdenekhor/ElektroDB.git"
    echo "  $ cd ElektroDB"
    echo ""
    echo "2️⃣  Stavba image:"
    echo "  $ docker build -t elektro-db ."
    echo ""
    echo "3️⃣  Spuštění kontejneru:"
    echo "  $ docker run -p 3000:3000 -v \$(pwd)/data:/app/data elektro-db"
    echo ""
    echo "   NEBO s docker-compose:"
    echo "  $ docker-compose up -d"
    echo ""
    echo "4️⃣  Kontrola:"
    echo "  $ docker ps"
    echo "  $ docker logs -f elektro-db"
    echo ""
    ;;

  3)
    echo ""
    echo "☁️  HEROKU NASAZENÍ"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "1️⃣  Instalujte Heroku CLI:"
    echo "  https://devcenter.heroku.com/articles/heroku-cli"
    echo ""
    echo "2️⃣  Přihlašte se:"
    echo "  $ heroku login"
    echo ""
    echo "3️⃣  Klonujte repozitář:"
    echo "  $ git clone https://github.com/zdenekhor/ElektroDB.git"
    echo "  $ cd ElektroDB"
    echo ""
    echo "4️⃣  Vytvořte aplikaci:"
    echo "  $ heroku create elektro-db-prod"
    echo ""
    echo "5️⃣  Nasaďte:"
    echo "  $ git push heroku main"
    echo ""
    echo "6️⃣  Sledujte:"
    echo "  $ heroku logs --tail"
    echo ""
    ;;

  4)
    echo ""
    echo "☁️  AWS EC2 NASAZENÍ"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "1️⃣  Vytvořte EC2 instanci (Ubuntu 22.04)"
    echo ""
    echo "2️⃣  SSH připojení:"
    echo "  $ ssh -i key.pem ubuntu@<instance-ip>"
    echo ""
    echo "3️⃣  Instalace:"
    echo "  $ sudo apt update && sudo apt upgrade -y"
    echo "  $ curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "  $ sudo sh get-docker.sh"
    echo "  $ sudo usermod -aG docker \$USER"
    echo ""
    echo "4️⃣  Klonování a spuštění:"
    echo "  $ git clone https://github.com/zdenekhor/ElektroDB.git"
    echo "  $ cd ElektroDB"
    echo "  $ docker-compose up -d"
    echo ""
    echo "5️⃣  Nginx proxy:"
    echo "  Viz DEPLOYMENT.md (AWS EC2 s Docker)"
    echo ""
    ;;

  5)
    echo ""
    echo "🖥️  VPS NASAZENÍ (DigitalOcean/Hetzner)"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "1️⃣  SSH připojení:"
    echo "  $ ssh root@<vps-ip>"
    echo ""
    echo "2️⃣  Instalace Node.js:"
    echo "  $ apt update && apt install -y nodejs npm"
    echo ""
    echo "3️⃣  Instalace PM2:"
    echo "  $ npm install -g pm2"
    echo ""
    echo "4️⃣  Setup aplikace:"
    echo "  $ git clone https://github.com/zdenekhor/ElektroDB.git"
    echo "  $ cd ElektroDB"
    echo "  $ npm install"
    echo ""
    echo "5️⃣  Spuštění s PM2:"
    echo "  $ pm2 start src/index.js --name \"elektro-db\""
    echo "  $ pm2 save && pm2 startup"
    echo ""
    echo "6️⃣  Nginx:"
    echo "  $ apt install -y nginx"
    echo "  Viz DEPLOYMENT.md (VPS)"
    echo ""
    ;;

  *)
    echo "❌ Neplatný výběr"
    exit 1
    ;;
esac

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📖 DOKUMENTACE:"
echo "  📄 README.md       - Přehled"
echo "  📄 DEPLOYMENT.md   - Detailní instrukce"
echo "  📄 SPUŠTĚNÍ.md     - Lokální spuštění"
echo "  📄 DEVELOPMENT.md  - Technické detaily"
echo ""
echo "🔗 GitHub: https://github.com/zdenekhor/ElektroDB"
echo ""
echo "✨ Máte otázky? Otevřete issue na GitHubu!"
echo ""
