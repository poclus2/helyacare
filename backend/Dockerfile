# ──────────────────────────────────────────────────────────────────
# HelyaCare — Backend Dockerfile (Medusa v2)
# ──────────────────────────────────────────────────────────────────
# syntax=docker/dockerfile:1

FROM node:22-alpine
WORKDIR /app

# Installer les dépendances
# --ignore-scripts évite les postinstall natifs (@swc/core, bcrypt) qui sont très lents.
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

# Migrations + Création Admin + démarrage
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa user -e admin@helyacare.com -p 'HelyaCare2026!' || true && npm run start"]
