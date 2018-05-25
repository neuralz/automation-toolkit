#!/bin/bash
[ -z "$1" ] && echo "must provide argument for version number" && exit 1;

HASH=`git rev-parse --short=16  HEAD`
echo "Version $1"

rm -rf ./release
mkdir ./release

docker build -t "ercdex/mm-api:$1" ./api
docker push "ercdex/mm-api:$1"
docker build -t "ercdex/mm-aqueduct-remote:$1" ./aqueduct-remote
docker push "ercdex/mm-aqueduct-remote:$1"
docker build -t "ercdex/mm-web:$1" ./web
docker push "ercdex/mm-web:$1"

cp docker-compose.release.yml ./release
mv ./release/docker-compose.release.yml ./release/docker-compose.yml
sed -i '' "s/\$HASH/$1/g" release/docker-compose.yml
sed -i '' "s/\$TOOLKIT_VERSION/$1/g" release/docker-compose.yml

cp README.MD ./release
cp run.sh ./release
cp check-path.sh ./release
cp update.sh ./release
zip -r "release.zip" ./release
echo "{ \"version\": \"$1\" }" > version.json
