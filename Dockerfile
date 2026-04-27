# ──────────────────────────────────────────────────────────────────
# HelyaCare — Dockerfile (Next.js standalone, multi-stage)
# Cible : Railway / Docker / VPS
# ──────────────────────────────────────────────────────────────────

# Étape 1 : Dépendances
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
# Installe uniquement les dépendances de production + dev pour le build
RUN npm ci

# Étape 2 : Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables nécessaires au build (remplacées par Railway en prod)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=true

RUN npm run build:prod

# Étape 3 : Image de production (légère)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copier les fichiers nécessaires au runtime
COPY --from=builder /app/public            ./public
COPY --from=builder /app/.next/standalone  ./
COPY --from=builder /app/.next/static      ./.next/static

# Catalogue produits (sera monté en volume persistent sur Railway)
COPY --from=builder /app/data ./data

# Dossier uploads (sera monté en volume persistent sur Railway)
RUN mkdir -p ./public/uploads && \
    chown -R nextjs:nodejs ./public/uploads ./data

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
