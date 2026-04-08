# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS base
SHELL ["/bin/bash", "-xe", "-o", "pipefail", "-c"]

WORKDIR /app

FROM base AS builder

ENV NEXT_TELEMETRY_DISABLED=1

COPY . .

RUN --mount=type=cache,id=pnpm,target=/tmp/pnpm-store \
    corepack enable && \
    corepack prepare pnpm@10.12.1 --activate && \
    pnpm config set store-dir /tmp/pnpm-store && \
    pnpm i --frozen-lockfile && \
    pnpm build

ENV NODE_ENV=production

# Merge native/external packages into standalone output (resolves pnpm symlinks)
# so the final image has complete dependencies at the paths Next.js expects.
RUN mkdir -p .next/standalone/node_modules/.pnpm && \
    cd node_modules/.pnpm && \
    for pkg in @tobilu+qmd* node-llama-cpp* better-sqlite3*; do \
      if [ -d "$pkg" ]; then \
        rm -rf /app/.next/standalone/node_modules/.pnpm/"$pkg" && \
        cp -rL "$pkg" /app/.next/standalone/node_modules/.pnpm/"$pkg"; \
      fi; \
    done

FROM gcr.io/distroless/nodejs22-debian12

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
