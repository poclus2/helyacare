# ──────────────────────────────────────────────────────────────────
# HelyaCare — Backend Dockerfile (Medusa v2)
# ──────────────────────────────────────────────────────────────────

FROM node:22-slim
WORKDIR /app

# Installer les dépendances système pour compiler les modules natifs (bcrypt, swc, etc.)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

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

