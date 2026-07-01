# ✅ NASAZENÍ - KONTROLNÍ SEZNAM

## 📋 PRE-DEPLOYMENT CHECKLIST

### Kód & Repozitář
- [ ] Všechny soubory jsou committed v git
- [ ] `git status` je čistý (clean)
- [ ] `git log` ukazuje správné commity
- [ ] Branch je `main`

### Instalace & Závislosti
- [ ] `npm install` úspěšně proběhne
- [ ] Žádné kritické security warnings
- [ ] `node_modules/` existuje
- [ ] `package-lock.json` je zakomitován

### Konfigurce
- [ ] `.env` soubor je vytvořen
- [ ] Všechny ENV proměnné jsou nastaveny
- [ ] Databázová cesta je správná
- [ ] DBF soubory jsou dostupné

### Data & Databáze
- [ ] DBF soubory existují v `PŘEHLED/csn_data/`
- [ ] `npm run import` úspěšně importuje data
- [ ] Databáze `data/elektro-db.sqlite` existuje
- [ ] Minimálně 2000+ norem je importováno

### Testy
- [ ] `npm run search "test"` funguje
- [ ] `npm run list` funguje
- [ ] `npm run export json` vytvoří soubor
- [ ] API odpovídá na požadavky

### Dokumentace
- [ ] README.md je aktuální
- [ ] DEPLOYMENT.md je na místě
- [ ] DEVELOPMENT.md má správné info
- [ ] SPUŠTĚNÍ.md je srozumitelný

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Going Live

- [ ] Všechny soubory zkontrolované
- [ ] Security audit proběhlo
- [ ] Databáze je zálohovaná
- [ ] Error handling je implementován
- [ ] Logs jsou nastaveny
- [ ] Monitoring je konfigurován

### Výběr Platformy

#### Lokální (Local)
- [ ] Node.js je instalován
- [ ] Npm je aktualizovaný
- [ ] Port 3000 je volný
- [ ] Soubory jsou v `~/ElektroDB`

#### Docker
- [ ] Docker je instalován
- [ ] Docker Compose je k dispozici
- [ ] `Dockerfile` je přítomen
- [ ] `docker-compose.yml` je konfigurován
- [ ] Volumes jsou správně namapovány

#### Heroku
- [ ] Heroku CLI je instalován
- [ ] Účet na Heroku existuje
- [ ] `Procfile` je správný
- [ ] Environment proměnné nastaveny
- [ ] Git remote je `heroku`

#### AWS EC2
- [ ] EC2 instance je vytvořena
- [ ] Security groups povolují SSH (22), HTTP (80), HTTPS (443)
- [ ] Key pair je stažený
- [ ] DNS je nakonfigurován
- [ ] Elastic IP je přiřazena

#### VPS
- [ ] VPS je pronajatá a dostupná
- [ ] SSH klíč je nastaven
- [ ] Firewall je nakonfigurován
- [ ] Domain má DNS záznamy
- [ ] SSL certifikát je k dispozici

### Nasazení

- [ ] Deploy skript je spuštěn
- [ ] Aplikace se úspěšně spustila
- [ ] Žádné chyby v logs
- [ ] Database je dostupná
- [ ] API je responsivní

### Post-Deployment

- [ ] Zdravotní kontrola (health check) prochází
- [ ] Vyhledávání funguje
- [ ] Export funguje
- [ ] Monitoring je aktivní
- [ ] Alerting je nastaveno
- [ ] Logs se zapisují
- [ ] Backup je naplánován

---

## 🔧 TROUBLESHOOTING

### Problém: npm install selhává

**Řešení:**
```bash
npm cache clean --force
npm install --build-from-source
```

### Problém: better-sqlite3 neinstaluje

**Řešení:**
```bash
# macOS
brew install python3
npm install --build-from-source

# Ubuntu/Debian
sudo apt install python3 build-essential
npm install --build-from-source

# Windows
npm install -g windows-build-tools
npm install --build-from-source
```

### Problém: Port 3000 obsazen

**Řešení:**
```bash
# Najít proces
lsof -i :3000

# Změnit port
PORT=3001 node src/index.js

# Nebo zabít proces
kill -9 PID
```

### Problém: Import DBF selhal

**Řešení:**
```bash
# Zkontrolovat soubory
ls -la PŘEHLED/csn_data/

# Vymazat starou DB
rm data/elektro-db.sqlite

# Zkusit znovu
npm run import
```

### Problém: Docker build selhává

**Řešení:**
```bash
# Vyčistit cache
docker builder prune

# Stavět bez cache
docker build --no-cache -t elektro-db .
```

### Problém: Databáze je uzamčena

**Řešení:**
```bash
# Zkontrolovat otevřené soubory
lsof | grep elektro-db.sqlite

# Vycistit lock soubory
rm data/*.db-wal
rm data/*.db-shm

# Restartovat aplikaci
pm2 restart elektro-db
```

---

## 📊 POST-DEPLOYMENT MONITORING

### Daily Checks
- [ ] Aplikace běží bez chyb
- [ ] Vyhledávání funguje
- [ ] Export funguje
- [ ] CPU < 80%
- [ ] Memory < 80%
- [ ] Disk < 90%

### Weekly Checks
- [ ] Logy jsou čisté
- [ ] Database je zdravá
- [ ] Žádné security warnings
- [ ] Performance je OK
- [ ] Backup je aktuální

### Monthly Checks
- [ ] Security patches
- [ ] Dependency updates
- [ ] Database optimization
- [ ] Disaster recovery test
- [ ] Performance review

---

## 🔐 SECURITY CHECKLIST

- [ ] HTTPS/SSL certifikát je instalován
- [ ] Firewall je nakonfigurován
- [ ] SSH klíče jsou zabezpečeny
- [ ] Database heslo je silné
- [ ] Environment proměnné nejsou v git
- [ ] Log soubory jsou zabezpečeny
- [ ] Backup soubory jsou šifrovány
- [ ] Access logs jsou monitoro<vány
- [ ] Rate limiting je nastaveno
- [ ] CORS je nakonfigurován

---

## 📞 KONTAKT & SUPPORT

- 📧 Issues: https://github.com/zdenekhor/ElektroDB/issues
- 💬 Discussions: https://github.com/zdenekhor/ElektroDB/discussions
- 🐛 Bug Reports: https://github.com/zdenekhor/ElektroDB/issues/new

---

## 📝 LOGS A MONITORING

### Lokální
```bash
# Real-time logs
npm run dev

# PM2 logs
pm2 logs elektro-db
```

### Docker
```bash
# Container logs
docker logs -f elektro-db

# Stats
docker stats
```

### Heroku
```bash
# Stream logs
heroku logs --tail

# Specific errors
heroku logs --num 100
```

### VPS (PM2)
```bash
# Monitor
pm2 monit

# Dashboard
pm2 web
# http://localhost:9615
```

---

**✨ Hotovo! Nasazení je připraveno.** 🚀

Máte otázky? Podívejte se na [DEPLOYMENT.md](DEPLOYMENT.md)
