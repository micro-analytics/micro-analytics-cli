#!/usr/bin/env node
const { exec } = require('shelljs');
const isAsyncSupported = require('is-async-supported');
const updateNotifier = require('update-notifier');

const pkg = require('./package.json');

updateNotifier({ pkg }).notify();

const microAnalytics = isAsyncSupported() ? './src/index' : './dist/index';

require(microAnalytics);
