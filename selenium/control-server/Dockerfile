FROM node:14-alpine3.10
# Choose working directory 
WORKDIR /usr/src/app
# Copy everything 
COPY . .
# Install dependencies
RUN yarn install

EXPOSE 80

CMD ["node","index.js"]