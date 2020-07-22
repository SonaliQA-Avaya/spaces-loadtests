FROM node:10-alpine
LABEL maintainer="ericd@avaya.com"

WORKDIR /home/node/artillery

COPY bin bin
COPY core core
COPY lib lib
COPY LICENSE.txt LICENSE.txt
COPY README.md README.md
COPY console-reporter.js console-reporter.js
COPY util.js util.js
COPY package.json package.json

RUN npm --ignore-scripts --production install

RUN mkdir -p /test
COPY deploy-artillery-v2/src/start.sh /test/loop.sh
# ENTRYPOINT ["/home/node/artillery/bin/artillery"]
