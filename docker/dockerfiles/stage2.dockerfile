FROM registry.itrcs3-app.intranet.chuv/ds-cicd-template-frontend-stage1:latest AS build

COPY frontend .
RUN pnpm test
RUN pnpm build

FROM nginx:alpine AS deploy
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/out /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]