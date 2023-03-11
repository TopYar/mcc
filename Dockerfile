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
ENV MCC_PORT=${MCC_PORT}
ENV MCC_PROJECT_NAME=${MCC_PROJECT_NAME}
ENV MCC_HASH_SALT=${MCC_HASH_SALT}
ENV MCC_DB_HOST=${MCC_DB_HOST}
ENV MCC_DB_PORT=${MCC_DB_PORT}
ENV MCC_DB_USER=${MCC_DB_USER}
ENV MCC_DB_PASSWORD=${MCC_DB_PASSWORD}
ENV MCC_DB_NAME=${MCC_DB_NAME}
ENV MCC_CONFIRMATION_PREFIX=${MCC_CONFIRMATION_PREFIX}
ENV MCC_SESSION_PREFIX=${MCC_SESSION_PREFIX}
ENV MCC_SESSION_KEY=${MCC_SESSION_KEY}
ENV MCC_SESSION_EXPIRE=${MCC_SESSION_EXPIRE}
ENV MCC_JWT_SECRET=${MCC_JWT_SECRET}
ENV MCC_JWT_ACCESS_EXPIRATION=${MCC_JWT_ACCESS_EXPIRATION}
ENV MCC_AES_IV=${MCC_AES_IV}
ENV MCC_AES_SECRET=${MCC_AES_SECRET}
ENV MCC_REDIS_HOST=${MCC_REDIS_HOST}
ENV MCC_REDIS_PORT=${MCC_REDIS_PORT}
ENV MCC_REDIS_PASS=${MCC_REDIS_PASS}
ENV MCC_MAIL_USER=${MCC_MAIL_USER}
ENV MCC_MAIL_PASSWORD=${MCC_MAIL_PASSWORD}
ENV MCC_MAIL_HOST=${MCC_MAIL_HOST}
ENV MCC_MAIL_PORT=${MCC_MAIL_PORT}
ENV MCC_MAIL_NAME=${MCC_MAIL_NAME}
EXPOSE ${MCC_PORT}
RUN npm install pm2 -g
#RUN pm2 start npm -- start:prod
#CMD ["pm2", "start npm -- start:prod"]