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

# Build Medusa — génère .medusa/server (--no-admin : évite la compilation Vite/React qui dépasse le délai Railway)
RUN npx medusa build --no-admin

# Exposer le port
EXPOSE 9000

# Migrations + Création Admin + démarrage
CMD ["sh", "-c", "npx medusa db:migrate && npx medusa user -e admin@helyacare.com -p 'HelyaCare2026!' || true && npm run start"]
