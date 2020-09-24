#!/bin/bash
set -e
set -x

cd "$(dirname "$0")"/..

echo "$GITCRYPT_KEY" | base64 -d > .key

rm -rf .git
git init
git remote add origin https://github.com/doofenshmirtz-deco-inc/secrets.git
git fetch
git checkout -t origin/master -f

git-crypt unlock .key