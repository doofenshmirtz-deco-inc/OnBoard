#!/bin/bash
set -e
set -x

cd "$(dirname "$0")"/..

docker-compose down

cd server
yarn run docker:down
cd -

rm -rfv ./*
