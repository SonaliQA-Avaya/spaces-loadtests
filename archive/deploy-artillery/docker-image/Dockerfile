FROM node:8.9.1

MAINTAINER Tiefeng Jia <jackj@esna.com>

# Install the required dependencies
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y
RUN apt-get install -y --no-install-recommends apt-utils
RUN apt-get install -y git build-essential

RUN yarn global add npm
RUN npm --version
RUN yarn global add bower
RUN bower --version
RUN yarn global add artillery

RUN mkdir /test

# copy files
ADD *.yaml /test/
ADD loop.sh /test/
RUN chmod 755 /test/loop.sh

WORKDIR /test

# start infinite loop to keep the container running
ENTRYPOINT ["/test/loop.sh"]
