FROM node:20-alpine

WORKDIR /app

# Instalace build tools
RUN apk add --no-cache python3 make g++

# Kopírování package.json
COPY package*.json ./

# Instalace dependencies
RUN npm ci --omit=dev --build-from-source || npm install --omit=dev --build-from-source

# Kopírování aplikace
COPY . .

# Vytvoření data adresáře
RUN mkdir -p data exports

# Import dat jen při prvním startu (pokud DB neexistuje)
CMD ["sh", "-c", "[ -f data/elektro-db.sqlite ] || npm run import; npm start"]

# Port
EXPOSE 3000
