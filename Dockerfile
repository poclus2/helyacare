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

ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BASE_URL

ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# .env.production est copié depuis le build context (voir .dockerignore)
# Next.js le lit automatiquement pendant npm run build
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

# Dossier uploads persistant
RUN mkdir -p ./public/uploads && \
    chown -R nextjs:nodejs ./public/uploads

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
