#!/bin/sh

# docker run --rm -v /home/madsdk/devel/aarhus-ml-machine:/code mcr.microsoft.com/vscode/devcontainers/typescript-node:0-16 /code/deployment/build.sh

npm install
npm build
