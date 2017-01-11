#!/usr/bin/env node

const { exec } = require('shelljs')
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({ pkg }).notify();

exec('npm start -- ' + process.argv.join(' '), {
  async: true,
  cwd: __dirname
})
