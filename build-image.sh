#/bin/bash

yarn build:server
PWD=$(cd "$(dirname "$0")"; pwd)
docker build -t ercdex/aqueduct-server .
docker push "ercdex/aqueduct-server"
