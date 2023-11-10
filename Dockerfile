#base image
#FROM node:9.6.1
FROM registry.itrcs3-app.intranet.chuv/ds-ubuntu:latest

USER root

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y curl

#set working directory
#RUN  mkdir /usr/src/app
WORKDIR /usr/src/app/

#install and cache app dependencies
COPY package.json /usr/src/app/
COPY . /usr/src/app/

COPY scripts/get_build_tools.sh .
COPY scripts/installs.sh .

RUN chmod +rwx get_build_tools.sh
RUN chmod +rwx installs.sh

RUN . ./get_build_tools.sh
RUN . ./installs.sh

RUN rm get_build_tools.sh
RUN rm installs.sh

EXPOSE 3000

#start app
CMD ["npm", "start"]