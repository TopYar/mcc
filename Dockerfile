FROM node:19-alpine3.16 AS appbuild
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
COPY . ./
RUN npm run build2


FROM node:19-alpine3.16
WORKDIR /usr/src/app
COPY --from=appbuild ./dist ./
COPY --from=appbuild package.json ./
RUN npm install pm2 -g
RUN pm2 start npm -- start:prod
EXPOSE ${PORT}