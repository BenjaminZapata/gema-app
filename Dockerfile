# --- Etapa 1: Instalar dependencias ---
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Etapa 2: Construir la aplicación ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next.js recopila telemetría anónima, la desactivamos para el build de producción
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Etapa 3: Entorno de ejecución en Producción ---
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Creamos un usuario del sistema para no correr Docker como root (Buenas prácticas de seguridad)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos los archivos necesarios desde la etapa de compilación
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

# Next.js por defecto corre en el puerto 3000
EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]