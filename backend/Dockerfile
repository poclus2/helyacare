# ──────────────────────────────────────────────────────────────────
# HelyaCare — Backend Dockerfile (Medusa v2)
# Résout le bug Nixpacks : le COPY final écrase .medusa/ (gitignored)
# ce qui cause "Could not find index.html in the admin build directory"
# ──────────────────────────────────────────────────────────────────

FROM node:22-alpine AS builder
WORKDIR /app

# Installer les dépendances
COPY package.json package-lock.json ./
RUN npm install -g npm@latest --quiet && npm ci

# Copier le code source
COPY . .

# Build Medusa — génère .medusa/server (admin dashboard inclus)
# NE PAS faire de COPY après ce point pour préserver .medusa/
RUN npm run build

# ──────────────────────────────────────────────────────────────────
# Image de production
# ──────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copier uniquement ce qui est nécessaire au runtime
# .medusa/ est copié depuis builder (pas depuis le dépôt git)
COPY --from=builder /app/node_modules  ./node_modules
COPY --from=builder /app/.medusa       ./.medusa
COPY --from=builder /app/package.json  ./package.json
COPY --from=builder /app/medusa-config.ts ./medusa-config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Exposer le port (Railway injecte PORT automatiquement)
EXPOSE 9000

# Migrations + démarrage
CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]
