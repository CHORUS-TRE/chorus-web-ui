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

FROM build1 as build2
ADD frontend .
EXPOSE 3002
CMD ["pnpm", "dev"]
