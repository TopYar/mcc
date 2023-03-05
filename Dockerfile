FROM node:19-alpine3.16 AS appbuild
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
COPY . ./
RUN npm run build2


FROM node:19-alpine3.16
WORKDIR /usr/src/app
COPY --from=appbuild /usr/src/app/dist /usr/src/app/dist
COPY --from=appbuild /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=appbuild /usr/src/app/package.json /usr/src/app/package.json
ENV PORT=${PORT}
EXPOSE ${PORT}
RUN npm install pm2 -g
#RUN pm2 start npm -- start:prod
#CMD ["pm2", "start npm -- start:prod"]