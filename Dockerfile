FROM node:19.6.1

RUN npm -i \
    npm run build2 \
    npm run start:prod