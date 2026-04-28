# ──────────────────────────────────────────────────────────────────
# HelyaCare — Backend Dockerfile (Medusa v2)
# ──────────────────────────────────────────────────────────────────

FROM node:22-alpine
WORKDIR /app

# Installer les dépendances
COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

# Copier le code source
COPY . .

# Build Medusa — génère .medusa/server
RUN npm run build
# Workaround: copier le dashboard admin vers public/admin car medusa start
# le cherche à cet emplacement (chemin relatif à la racine du projet).
RUN mkdir -p public && cp -r .medusa/server/public/admin public/admin || true

# Exposer le port
EXPOSE 9000

# Migrations + démarrage
CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]

