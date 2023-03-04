FROM node:19.6.1

WORKDIR /usr/src/app

RUN npm install pm2 -g
EXPOSE ${PORT}