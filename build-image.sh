#/bin/bash

yarn build:server
PWD=$(cd "$(dirname "$0")"; pwd)
docker build -t aqueduct-server .
docker push "ercdex/aqueduct-server"
