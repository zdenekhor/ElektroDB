FROM node:18-alpine

WORKDIR /app

# Instalace build tools
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev

# Kopírování package.json
COPY package*.json ./

# Instalace dependencies
RUN npm install --build-from-source

# Kopírování aplikace
COPY . .

# Vytvoření data adresáře
RUN mkdir -p data exports

# Import dat (při startu kontejneru)
CMD ["sh", "-c", "npm run import && node src/index.js"]

# Port
EXPOSE 3000
