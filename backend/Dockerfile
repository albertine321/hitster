# Bruk offisiell Node.js image
FROM node:18-alpine

# Sett arbeidsmappen i containeren
WORKDIR /app

# Kopier package.json og installer avhengigheter
COPY package*.json ./
RUN npm install

# Kopier resten av koden
COPY . .

# Eksponer porten Express kjører på
EXPOSE 3003

# Start serveren
CMD ["node", "server.js"]