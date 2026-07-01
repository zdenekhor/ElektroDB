# 🚀 Nasazení ElektroDB - Kompletní Průvodce

## Obsah
1. [Lokální nasazení](#lokální-nasazení)
2. [Docker nasazení](#docker-nasazení)
3. [Produkční nasazení](#produkční-nasazení)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Monitorování a údržba](#monitorování-a-údržba)

---

## Lokální Nasazení

### Požadavky
- **Node.js** 14.0 nebo novější
- **npm** 6.0 nebo novější
- **Python 3** (pro better-sqlite3 build)
- **Git**

### Instalace (macOS/Linux/Windows)

```bash
# 1. Klonování repozitáře
git clone https://github.com/zdenekhor/ElektroDB.git
cd ElektroDB

# 2. Instalace dependencies
npm install

# Pokud máte problémy s better-sqlite3:
npm install --build-from-source

# 3. Import dat z DBF
npm run import

# 4. Spuštění
node src/index.js
```

### Testování

```bash
# Vyhledávání
npm run search "elektro"

# Výpis aktivních norem
npm run list active

# Export do JSON
npm run export json

# Export do CSV
npm run export csv
```

---

## Docker Nasazení

### Rychlé spuštění

```bash
# Stavba image
docker build -t elektro-db .

# Spuštění kontejneru
docker run -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/exports:/app/exports \
  elektro-db
```

### Pomocí Docker Compose

```bash
# Instalace docker-compose
# https://docs.docker.com/compose/install/

# Spuštění
docker-compose up -d

# Logs
docker-compose logs -f elektro-db

# Zastavení
docker-compose down
```

### Docker Hub (Push)

```bash
# Login
docker login

# Tag image
docker tag elektro-db username/elektro-db:latest

# Push
docker push username/elektro-db:latest
```

---

## Produkční Nasazení

### A) Heroku

```bash
# Instalace Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Vytvoření aplikace
heroku create elektro-db-production

# Nastavení environment
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Logs
heroku logs --tail
```

### B) DigitalOcean App Platform

```bash
# Přihlášení
doctl auth init

# Vytvoření app
doctl apps create --spec app.yaml

# Úprava app.yaml:
name: elektro-db
services:
  - name: web
    build_command: npm install
    run_command: npm start
    ports:
      - 3000
    envs:
      - key: NODE_ENV
        value: production
```

### C) AWS Elastic Beanstalk

```bash
# Instalace EB CLI
pip install awsebcli

# Inicializace
eb init elektro-db --platform "Node.js 18"

# Vytvoření prostředí
eb create prod-env

# Deploy
eb deploy

# Status
eb status
eb logs
```

### D) AWS EC2 s Docker

```bash
# 1. SSH do EC2 instance
ssh -i key.pem ec2-user@instance-ip

# 2. Instalace Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Clone repo a spustí docker-compose
git clone https://github.com/zdenekhor/ElektroDB.git
cd ElektroDB
sudo docker-compose up -d

# 4. Nginx reverse proxy
sudo nano /etc/nginx/sites-available/default
# Nastavit proxy_pass http://localhost:3000;
sudo systemctl restart nginx
```

### E) VPS (Linode/Hetzner/Vultr)

```bash
# 1. SSH
ssh root@vps-ip

# 2. Aktualizace systému
apt update && apt upgrade -y

# 3. Instalace Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 4. Instalace PM2 (process manager)
npm install -g pm2

# 5. Clone a setup
git clone https://github.com/zdenekhor/ElektroDB.git
cd ElektroDB
npm install

# 6. Spuštění s PM2
pm2 start src/index.js --name "elektro-db"
pm2 save
pm2 startup

# 7. Nginx reverse proxy
apt install -y nginx
sudo nano /etc/nginx/sites-available/default
# Nastavit proxy_pass http://localhost:3000;
sudo systemctl restart nginx

# 8. SSL certifikát (Let's Encrypt)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

---

## CI/CD Pipeline

### GitHub Actions

Vytvořit `.github/workflows/deploy.yml`:

```yaml
name: Deploy ElektroDB

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install dependencies
        run: npm install
      
      - name: Lint
        run: npm run lint --if-present
      
      - name: Test
        run: npm test --if-present

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: elektro-db-production
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

---

## Monitorování a Údržba

### PM2 Monitoring

```bash
# Instalace PM2+
pm2 plus

# Zobrazení dashboardu
pm2 monit

# Info o procesu
pm2 info elektro-db

# Restart
pm2 restart elektro-db

# Logs
pm2 logs elektro-db
```

### Docker Monitoring

```bash
# Container status
docker ps

# Logs
docker logs -f container_name

# Resource usage
docker stats

# Aktualizace image
docker pull username/elektro-db:latest
docker-compose up -d --force-recreate
```

### Databáze Backup

```bash
# Lokální backup
cp data/elektro-db.sqlite backups/elektro-db-$(date +%Y%m%d).sqlite

# Komprese
tar -czf backups/elektro-db-backup-$(date +%Y%m%d).tar.gz data/

# Cloud backup (AWS S3)
aws s3 cp data/elektro-db.sqlite s3://my-bucket/backups/
```

### Health Check

```bash
# Kontrola výstupů
curl http://localhost:3000

# Stav služby
npm run search "test"

# DB kontrola
npm run list
```

---

## Troubleshooting

### npm install selhává
```bash
npm install --build-from-source
# nebo
npm cache clean --force
npm install
```

### Port 3000 je obsazen
```bash
# Najít proces
lsof -i :3000

# Změnit port
PORT=3001 node src/index.js
```

### Import DBF selhává
```bash
# Zkontrolovat soubory
ls -la PŘEHLED/csn_data/

# Reboot import
rm data/elektro-db.sqlite
npm run import
```

### Docker build selhává
```bash
# Vyčistit cache
docker builder prune

# Stavěte znovu
docker build --no-cache -t elektro-db .
```

---

## Produkční Checklist

- [ ] Kód je committed v git
- [ ] Všechny testy prochází
- [ ] ENV proměnné jsou nastaveny
- [ ] Databáze je importována
- [ ] SSL certifikát je nainstalován
- [ ] Backup strategie je nastavena
- [ ] Monitoring je aktivní
- [ ] Logs jsou nastaveny
- [ ] Firewall pravidla jsou nakonfigurována
- [ ] Fail-over mechanismus je připraven

---

## Kontakt & Support

- 📧 Email: support@elektro-db.com
- 🐛 Issues: https://github.com/zdenekhor/ElektroDB/issues
- 💬 Discussions: https://github.com/zdenekhor/ElektroDB/discussions
