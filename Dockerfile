# ──────────────────────────────────────────────────────────────────
# HelyaCare — Dockerfile (Next.js, multi-stage)
# Usage : déploiement VPS / Docker manuel
# Pour Railway → utiliser Nixpacks (railway.toml) — plus simple
# ──────────────────────────────────────────────────────────────────

# Étape 1 : Dépendances
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
# Upgrade npm pour correspondre à la version locale (npm 11)
# node:20-alpine embarque npm 10 qui ne peut pas lire le lockfileVersion 3
RUN npm install -g npm@11 --quiet && npm ci

# Étape 2 : Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build standard (pas de standalone — évite bug Turbopack + middleware.js.nft.json)
RUN npm run build

# Étape 3 : Image de production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copier le build complet (pas standalone — plus volumineux mais compatible)
COPY --from=builder /app/public            ./public
COPY --from=builder /app/.next             ./.next
COPY --from=builder /app/node_modules      ./node_modules
COPY --from=builder /app/package.json      ./package.json

# Catalogue produits
COPY --from=builder /app/data ./data

# Dossier uploads persistant
RUN mkdir -p ./public/uploads && \
    chown -R nextjs:nodejs ./public/uploads ./data

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
