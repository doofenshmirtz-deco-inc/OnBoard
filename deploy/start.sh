#!/bin/bash
set -e
set -x

cd "$(dirname "$0")"/..

docker network create meet.jitsi || true

cd server
yarn run docker:up
cd -

docker-compose up -d
