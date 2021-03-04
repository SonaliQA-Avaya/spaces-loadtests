FROM ubuntu:latest
WORKDIR /usr/client/app
RUN ["apt-get","update"]
# Install node js
RUN ["apt-get","-y","install","curl"]
CMD "curl -sL https://deb.nodesource.com/setup_14.x | bash"
RUN ["apt-get","-y","install","nodejs"]
RUN ["apt-get","-y","install","npm"]
# Install xvfb
RUN ["apt-get","install","-y","xvfb"]
RUN ["apt-get","-y","install","wget"]
RUN ["apt-get","update"]
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN apt-get -y update
RUN apt-get install -y google-chrome-stable
RUN apt-get install -yqq unzip
RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/` curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`/chromedriver_linux64.zip
RUN unzip /tmp/chromedriver.zip chromedriver -d ./
COPY . .
RUN npm install
ENTRYPOINT ["sh","./start.sh"]
