# ──────────────────────────────────────────────────────────────────
# HelyaCare — Backend Dockerfile (Medusa v2)
# ──────────────────────────────────────────────────────────────────
# syntax=docker/dockerfile:1

FROM node:22-slim
WORKDIR /app

# Installer les dépendances
# NOTE: pas de build tools (python3/make/g++) — les paquets natifs (@swc/core, bcrypt)
# téléchargent des binaires pré-compilés ce qui est BEAUCOUP plus rapide.
# Le cache mount /root/.npm évite de re-télécharger entre les builds.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install

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
