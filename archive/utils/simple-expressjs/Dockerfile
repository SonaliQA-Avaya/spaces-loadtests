ARG NODE_VERSION="6.11.3"
FROM node:${NODE_VERSION}

ARG USER="node"
ARG GROUP="node"
ARG TARGET_DIR="/app"

RUN mkdir ${TARGET_DIR}

# node base image has built-in user node
USER ${USER}
COPY . ${TARGET_DIR}

USER root
RUN chown -R ${USER}.${GROUP} ${TARGET_DIR}

USER ${USER}
WORKDIR ${TARGET_DIR}
RUN npm install

# register and enable service
USER root
COPY loadtest-simpleexpressjs.service /etc/systemd/system
# RUN systemctl enable loadtest-simpleexpressjs.service

EXPOSE 6666

# start server
CMD ["node", "index.js"]
