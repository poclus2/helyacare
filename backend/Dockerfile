FROM node:20

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Build de Medusa
RUN npx medusa build

EXPOSE 9000

# Démarrage avec migration automatique
CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]
