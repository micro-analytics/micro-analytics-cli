#!/usr/bin/env node

const { exec } = require('shelljs')

exec('npm start', {
  async: true,
  cwd: __dirname
})
