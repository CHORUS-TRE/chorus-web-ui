#base image
#FROM node:9.6.1
FROM registry.itrcs3-app.intranet.chuv/ds-ubuntu:latest as build-deps

USER root

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y curl

#set working directory
WORKDIR /usr/src/app/

#install and cache app dependencies
COPY package.json /usr/src/app/

COPY scripts/get_build_tools.sh .
COPY scripts/installs.sh .

RUN chmod +rwx get_build_tools.sh
RUN chmod +rwx installs.sh

RUN . ./get_build_tools.sh
RUN . ./installs.sh

RUN rm get_build_tools.sh
RUN rm installs.sh

RUN npm install
COPY . .

#test before deploying to prod
RUN CI=true npm test

#build
RUN npm run build

# Deploy
FROM nginx:alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]