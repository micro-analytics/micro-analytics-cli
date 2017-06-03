#!/usr/bin/env node

const { exec } = require('shelljs');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({ pkg }).notify();

const supportsAsyncAwait =
  parseInt(process.version.slice(1).split('.').join('')) > 760;

const microAnalytics = supportsAsyncAwait ? './src/index' : './dist/index';

require(microAnalytics);
