#!/bin/bash

cd packages/micro-analytics-cli

rm -rf node_modules

export NODE_ENV=production

npm install
npm run now-build
npm run now-start
