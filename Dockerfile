#base image
FROM node:9.6.1

#set working directory
#RUN  mkdir /usr/src/app
WORKDIR /app

#install and cache app dependencies
COPY package.json .

COPY scripts/get_build_tools.sh .
RUN chmod +rwx get_build_tools.sh
RUN ls -la
RUN . ./get_build_tools.sh
RUN rm get_build_tools.sh

#start app
CMD ["npm", "start"]