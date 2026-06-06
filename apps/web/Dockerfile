FROM oven/bun:1.3.9-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY bun.lock package.json turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

RUN bun install

COPY apps/web ./apps/web

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN bun run build --filter=web

FROM oven/bun:1.3.9-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["node", "apps/web/server.js"]