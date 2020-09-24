#!/bin/bash
set -e
set -x

cd "$(dirname "$0")"/..

docker build server -o - | gzip > server.tar.gz
docker build client -o - | gzip > server.tar.gz
