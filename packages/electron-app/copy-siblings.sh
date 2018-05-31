#/bin/bash
echo Copying Siblings
rm -rf node_modules/@ercdex
mkdir node_modules/@ercdex
cp -R ../api node_modules/@ercdex/market-maker-api
cp -R ../aqueduct-remote node_modules/@ercdex/aqueduct-remote
cp -R ../aqueduct node_modules/@ercdex/aqueduct
echo Done Copying Siblings
