.PHONY: help install import search list export clean docker docker-build docker-compose-up docker-compose-down deploy test

help:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║         🚀 ELEKTRO DB - MAKEFILE PŘÍKAZY                  ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "Instalace & Spuštění:"
	@echo "  make install          - Nainstaluj dependencies (npm install)"
	@echo "  make import           - Importuj data z DBF souborů"
	@echo "  make run              - Spusť aplikaci"
	@echo ""
	@echo "CLI Příkazy:"
	@echo "  make search Q=elektro - Vyhledej norem"
	@echo "  make list [S=active]  - Vypiš normy [s filtrem]"
	@echo "  make export F=json    - Exportuj data (json|csv)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build     - Stavěj Docker image"
	@echo "  make docker-run       - Spusť v Docker kontejneru"
	@echo "  make docker-compose   - Spusť docker-compose"
	@echo ""
	@echo "Vývojové:"
	@echo "  make dev              - Watch mód s automatickým restartem"
	@echo "  make test             - Spusť testy"
	@echo "  make lint             - Lint (pokud konfigurováno)"
	@echo "  make clean            - Smaž cache a temp soubory"
	@echo ""
	@echo "Nasazení:"
	@echo "  make deploy           - Interaktivní volba nasazení"
	@echo "  make deploy-heroku    - Deploy na Heroku"
	@echo "  make deploy-docker    - Deploy Docker image"
	@echo ""

# ============================================================
# INSTALACE A SETUP
# ============================================================

install:
	@echo "📦 Instaluji dependencies..."
	npm install --legacy-peer-deps
	@echo "✅ Instalace hotova!"

import:
	@echo "📋 Importuji data z DBF souborů..."
	npm run import
	@echo "✅ Import hotov!"

run:
	@echo "🚀 Spouštím aplikaci..."
	node src/index.js

# ============================================================
# CLI PŘÍKAZY
# ============================================================

search:
	@if [ -z "$(Q)" ]; then \
		echo "❌ Nezadali jste query. Syntax: make search Q='elektro'"; \
	else \
		echo "🔍 Vyhledávám: $(Q)"; \
		npm run search "$(Q)"; \
	fi

list:
	@if [ -z "$(S)" ]; then \
		echo "📋 Vypisuji všechny normy..."; \
		npm run list; \
	else \
		echo "📋 Vypisuji normy se statusem: $(S)"; \
		npm run list "$(S)"; \
	fi

export:
	@if [ -z "$(F)" ]; then \
		echo "❌ Nezadali jste formát. Syntax: make export F=json (nebo csv)"; \
	else \
		echo "📤 Exportuji do formátu: $(F)"; \
		npm run export "$(F)"; \
	fi

# ============================================================
# DOCKER
# ============================================================

docker-build:
	@echo "🐳 Stavím Docker image..."
	docker build -t elektro-db .
	@echo "✅ Docker image hotov!"

docker-run:
	@echo "🐳 Spouštím Docker kontejner..."
	docker run -p 3000:3000 \
		-v $(PWD)/data:/app/data \
		-v $(PWD)/exports:/app/exports \
		--name elektro-db \
		elektro-db
	@echo "✅ Docker běží na http://localhost:3000"

docker-compose:
	@echo "🐳 Spouštím docker-compose..."
	docker-compose up -d
	@echo "✅ Services běží!"

docker-stop:
	@echo "🛑 Zastavuji Docker..."
	docker-compose down
	@echo "✅ Docker zastaveno!"

docker-logs:
	@echo "📋 Logs:"
	docker-compose logs -f elektro-db

# ============================================================
# VÝVOJOVÉ
# ============================================================

dev:
	@echo "👀 Watch mód - aplikace se automaticky restartnne..."
	node --watch src/index.js

test:
	@echo "🧪 Spouštím testy..."
	npm test --if-present
	@echo "✅ Testy hotovy!"

lint:
	@echo "🔍 Linting..."
	npm run lint --if-present
	@echo "✅ Lint hotov!"

clean:
	@echo "🧹 Čistím cache..."
	rm -rf node_modules/.cache
	rm -rf dist build
	rm -f *.log
	npm cache clean --force
	@echo "✅ Cache vyčištěn!"

# ============================================================
# NASAZENÍ
# ============================================================

deploy:
	@echo "🚀 Interaktivní nasazení..."
	@bash deploy-interactive.sh

deploy-heroku:
	@echo "☁️  Nasazuji na Heroku..."
	@if [ -z "$(APP)" ]; then \
		echo "❌ Nezadali jste APP. Syntax: make deploy-heroku APP=elektro-db-prod"; \
	else \
		heroku create $(APP) || true; \
		git push heroku main; \
		heroku logs --tail -a $(APP); \
	fi

deploy-docker:
	@echo "🐳 Docker push..."
	@if [ -z "$(REGISTRY)" ]; then \
		echo "❌ Nezadali jste REGISTRY. Syntax: make deploy-docker REGISTRY=docker.io/username"; \
	else \
		docker tag elektro-db $(REGISTRY)/elektro-db:latest; \
		docker push $(REGISTRY)/elektro-db:latest; \
		echo "✅ Docker image pushnuto!"; \
	fi

# ============================================================
# INFO
# ============================================================

info:
	@echo "📊 Informace o projektu:"
	@echo ""
	@echo "Node.js:"
	@node --version
	@echo "npm:"
	@npm --version
	@echo ""
	@echo "Soubory:"
	@find src -name "*.js" | wc -l
	@echo "  JavaScript souborů"
	@echo ""
	@echo "Velikost:"
	@du -sh . 2>/dev/null || echo "N/A"

stats:
	@echo "📈 Statistika:"
	@echo ""
	@echo "Kód:"
	@find src -name "*.js" -exec wc -l {} + | tail -1
	@echo ""
	@echo "Dokumentace:"
	@find . -name "*.md" -exec wc -l {} + | tail -1

# ============================================================
# HELP
# ============================================================

.DEFAULT_GOAL := help
