FROM registry.itrcs3-app.intranet.chuv/ds-ubuntu:latest AS builder

USER root

WORKDIR /app

RUN apt-get update -y && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh
RUN bash /tmp/nodesource_setup.sh
RUN apt-get install -y nodejs

RUN npm install -g pnpm
COPY frontend/package*.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile