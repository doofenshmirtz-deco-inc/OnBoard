#!/bin/bash
set -e
set -x

cd "$(dirname "$0")"/..

docker network create meet.jitsi || true

cd server
cat ./TOKEN.txt | docker login https://docker.pkg.github.com -u kentonlam --password-stdin
yarn run docker:up
cd -

docker-compose up -d
