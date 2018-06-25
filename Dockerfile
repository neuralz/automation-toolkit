FROM node:9.11.1

RUN mkdir -p /app
RUN mkdir -p /app/keys
COPY package.json /app
COPY yarn.lock /app

WORKDIR /app
RUN yarn --production

COPY . /app

EXPOSE 8700
ENTRYPOINT node ./dist/node/aqueduct-server/start-server.js
