FROM node:20

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation standard (nécessaire pour esbuild / admin dashboard)
RUN npm install --no-fund --no-audit

# Copie du code source
COPY . .

# Build de Medusa pour la production (génère l'admin dashboard)
ENV NODE_ENV=production
RUN npx medusa build

EXPOSE 9000

# Démarrage avec migration automatique
CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]
