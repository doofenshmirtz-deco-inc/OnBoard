#!/bin/bash
set -e
set -x

cd "$(dirname "$0")"/..

cd server
yarn run docker:up
cd -

docker-compose up -d
