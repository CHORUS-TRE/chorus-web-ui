FROM registry.itrcs3-app.intranet.chuv/ds-ubuntu:latest AS builder

USER root

WORKDIR /app

ADD scripts ./scripts/
RUN chmod +x ./scripts/
RUN . ./scripts/get_build_tools.sh
RUN . ./scripts/install.sh
RUN rm -r ./scripts

FROM builder AS build1
COPY frontend/package*.json frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

FROM build1 AS build2
COPY frontend .
RUN pnpm build
RUN ls -la .next

FROM nginx:alpine AS deploy
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build2 /app/.next /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
