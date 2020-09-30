#!/bin/bash
set -x

cd "$(dirname "$0")"/..

docker system prune -f

docker-compose down -v

cd server
yarn run docker:down
cd -

rm -rf ./*
