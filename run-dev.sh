#/bin/bash

yarn build:server
PWD=$(cd "$(dirname "$0")"; pwd)
docker build -t aqueduct-server .
docker run -it -p 8700:8700 -v $PWD/keys:/app/keys aqueduct-server
