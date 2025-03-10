# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim AS base
SHELL ["/bin/bash", "-xe", "-o", "pipefail", "-c"]

WORKDIR /app

FROM base AS builder

ENV NEXT_TELEMETRY_DISABLED=1
ENV COREPACK_INTEGRITY_KEYS=0

COPY . .

RUN --mount=type=cache,id=pnpm,target=/tmp/pnpm-store \
    corepack enable && \
    corepack prepare pnpm@9.15.3 --activate && \
    pnpm config set store-dir /tmp/pnpm-store && \
    pnpm i --frozen-lockfile && \
    pnpm build

ENV NODE_ENV=production

FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static .next/static

EXPOSE 3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production
ENV PORT=3000

USER nonroot

CMD ["server.js"]
