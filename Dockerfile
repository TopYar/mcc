FROM node:19.6.1

WORKDIR /usr/src/app

RUN npm install forever -g
EXPOSE ${PORT}