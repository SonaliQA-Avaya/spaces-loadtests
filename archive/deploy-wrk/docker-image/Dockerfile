# Start with a base debian jessie image
FROM debian:jessie-slim

MAINTAINER Tiefeng Jia <jackj@esna.com>

# Install the required dependencies
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y
RUN apt-get install -y --no-install-recommends apt-utils
RUN apt-get install -y git make build-essential libssl-dev openssl unzip wget
RUN apt-get install -y luajit lua5.1 liblua5.1-dev

# extent server limitation
RUN ulimit -n 1000000

# prepare test folder
RUN mkdir /test

# install wrk
WORKDIR /test
RUN git clone https://github.com/wg/wrk.git
WORKDIR /test/wrk
RUN make
RUN mv wrk /usr/local/bin

# install luarocks and yaml package
WORKDIR /test
RUN wget https://keplerproject.github.io/luarocks/releases/luarocks-2.4.1.tar.gz
RUN tar zxvf luarocks-2.4.1.tar.gz
WORKDIR /test/luarocks-2.4.1
RUN ./configure
RUN make build
RUN make install
RUN luarocks install yaml

WORKDIR /test

# copy files
ADD *.yaml /test/
ADD *.lua /test/
ADD loop.sh /test/
RUN chmod 755 /test/loop.sh

# start infinite loop to keep the container running
ENTRYPOINT ["/test/loop.sh"]
