#!/usr/bin/env node

const { exec } = require('shelljs')

exec('npm start -- ' + process.argv.join(' '), {
  async: true,
  cwd: __dirname
})
