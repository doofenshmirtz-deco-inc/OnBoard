#!/bin/bash
set -e
set -x

cd "$(dirname "$0")"/..

docker network create meet.jitsi || true

aws ssm get-parameters --region ap-southeast-2 --names git-crypt --with-decryption --query Parameters[0].Value \
    | tr -d \" | base64 -d > .key

git init
git remote add origin https://github.com/doofenshmirtz-deco-inc/secrets.git
git fetch
git checkout -t origin/master -f

git-crypt unlock .key

cd server
cat ./TOKEN.txt | docker login https://docker.pkg.github.com -u kentonlam --password-stdin
yarn
yarn run docker:up
cd -

docker-compose up -d
