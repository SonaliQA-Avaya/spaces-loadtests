FROM node:10-alpine
LABEL maintainer="ericd@avaya.com"

RUN apk add --no-cache --upgrade bash

WORKDIR /home/node/artillery
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm --ignore-scripts --production install
COPY bin bin
COPY core core
COPY lib lib
COPY LICENSE.txt LICENSE.txt
COPY README.md README.md
COPY console-reporter.js console-reporter.js
COPY util.js util.js

RUN mkdir -p /app
COPY deploy-artillery-v2/loop.sh /app/loop.sh
RUN chmod 755 /app/loop.sh
WORKDIR /app

