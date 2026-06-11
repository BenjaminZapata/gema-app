# --- Etapa 1: Dependencias en caché ---
FROM node:22.16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos SOLO los archivos de paquetes primero para congelar la capa de npm install
COPY package*.json ./
RUN npm ci

# --- Etapa 2: Compilación optimizada con caché ---
FROM node:22.16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Forzamos a Next.js a usar una carpeta de caché persistente dentro de Docker
RUN --mount=type=cache,target=/app/.next/cache npm run build

# --- Etapa 3: El entorno de ejecución más ligero posible (Standalone) ---
FROM node:22.16-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# El modo standalone de Next extrae solo los archivos necesarios para correr, reduciendo el peso un 80%
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# En modo standalone, Next arranca directamente desde su servidor optimizado, no con npm start
CMD ["node", "server.js"]