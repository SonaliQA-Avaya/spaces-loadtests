# Start with a base debian jessie image
FROM debian:jessie

MAINTAINER Tiefeng Jia <jackj@esna.com>

# Install the required dependencies
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y
RUN apt-get install -y --no-install-recommends apt-utils
RUN apt-get install -y default-jdk wget git python2.7 mongodb-clients mongodb-dev
RUN ln -s /usr/bin/python2.7 /usr/bin/python

# extent server limitation
RUN ulimit -n 1000000

# prepare test folder
RUN mkdir /test

# copy files
ADD loop.sh /test/
RUN chmod 755 /test/loop.sh

# install maven - ycsb requires higher version than default maven package
WORKDIR /test
RUN wget http://httpd-mirror.sergal.org/apache/maven/maven-3/3.5.0/binaries/apache-maven-3.5.0-bin.tar.gz
RUN tar zxvf apache-maven-3.5.0-bin.tar.gz
ENV PATH="${PATH}:/test/apache-maven-3.5.0/bin"

# install ycsb
WORKDIR /test
RUN git clone https://github.com/jackesna/YCSB.git
WORKDIR /test/YCSB
RUN mvn -pl com.yahoo.ycsb:mongodb-binding -am clean package
ENV PATH="${PATH}:/test/YCSB/bin"

WORKDIR /test/YCSB

# start infinite loop to keep the container running
ENTRYPOINT ["/test/loop.sh"]
