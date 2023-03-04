FROM node:19.6.1

RUN ["CMD", "npm -i"]
RUN ["CMD", "npm run build2"]
RUN ["CMD", "npm run start:prod"]