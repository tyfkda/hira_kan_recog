#!/bin/bash

set -e

npm run release
cp -r release/* ../gh-pages/

pushd ../gh-pages
git add .
git commit --amend -m 'Deploy'
git push -f
popd
