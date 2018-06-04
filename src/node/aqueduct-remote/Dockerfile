FROM node:9.11.1

RUN mkdir -p /app
RUN mkdir -p /app/keys
COPY package.json /app
COPY yarn.lock /app
RUN apt-get update

WORKDIR /app
RUN yarn

COPY . /app
RUN yarn build

EXPOSE 8700
ENTRYPOINT yarn start:server
