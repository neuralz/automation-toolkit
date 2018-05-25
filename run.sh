#!/bin/bash
[ -z "$1" ] && echo "must provide chain: mainnet or kovan (testnet)" && exit 1;

sh ./check-path.sh
ETHEREUM_CHAIN=$1 docker-compose up --build
