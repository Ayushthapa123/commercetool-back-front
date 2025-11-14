FROM node:22-alpine AS base
RUN apk add --no-cache libcap-setcap
RUN apk add --no-cache curl

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Env values required by codegen during build
RUN --mount=type=secret,id=ENV \
    cat /run/secrets/ENV > ./.env \ 
    && npm run build 

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

RUN addgroup --system --gid 1001 nodejs \
&& adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

HEALTHCHECK --interval=15s --timeout=3s \
  CMD curl -f http://localhost/api/health/liveness || exit 1

EXPOSE 80
ENV PORT=80

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
