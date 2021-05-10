FROM loadimpact/k6:0.27.0

WORKDIR /app

COPY . .


ENTRYPOINT k6 run src/spaces.test.js --quiet --tag instance=$POD_GROUP$POD_INDEX \
  -e DATA_PATH='../data/users-chunked/' \
  -e DATA_FILE_PREFIX=users_
