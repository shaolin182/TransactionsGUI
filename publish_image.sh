#!/usr/bin/env bash

# Build project
gulp build

# build Docker image
docker build . --tag jugirard/transactions-gui-angularjs:${VERSION}

# Login to docker registry
echo ${REGISTRY_PASSWORD} | docker login -u ${REGISTRY_USERNAME} --password-stdin

# Publish image
docker push jugirard/transactions-gui-angularjs:${VERSION}

docker logout

