FROM node:19.6.1 AS appbuild
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i
COPY . ./
RUN npm run build2


FROM node:19.6.1
WORKDIR /usr/src/app
COPY --from=appbuild /usr/src/app/dist /usr/src/app/dist
COPY --from=appbuild /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=appbuild /usr/src/app/package.json /usr/src/app/package.json
RUN npm run start:prod
EXPOSE ${PORT}