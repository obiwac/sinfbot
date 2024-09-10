#!/bin/bash

GIT_COMMIT=$(git rev-parse HEAD)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
GIT_REMOTE=$(git config --get remote.origin.url)

docker compose build --build-arg GIT_COMMIT=$GIT_COMMIT --build-arg GIT_BRANCH=$GIT_BRANCH --build-arg GIT_REMOTE=$GIT_REMOTE
docker compose up -d
