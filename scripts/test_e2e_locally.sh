#!/bin/bash

set -e

# This script is mostly used to test snapshots in a cross-platform way, with
# same output as in CI
# For example: `BASE_URL=http://192.168.1.30:8000 ./node_modules/.bin/playwright test src --grep @snapshot`

if [ -n "$(docker ps --all | grep playwright-demos || true)" ]; then
  echo "Starting existing container"
  docker start playwright-demos
  docker exec -it playwright-demos /bin/bash
  exit 0
fi

docker run \
  -it \
  -v $(pwd):/work/ \
  --workdir /work/ \
  --network host \
  --name playwright-demos \
  mcr.microsoft.com/playwright:latest \
  /bin/bash
