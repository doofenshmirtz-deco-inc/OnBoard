#!/bin/bash
set -e
set -x

docker-compose down

cd server
yarn run docker:down
cd -

rm -rfv ./