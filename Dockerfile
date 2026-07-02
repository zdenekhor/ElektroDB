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

# Import dat při buildu image (rychlejší start kontejneru na Renderu)
RUN npm run import

# Spuštění aplikace
CMD ["npm", "start"]

# Port
EXPOSE 3000
