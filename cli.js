#!/usr/bin/env node

const { exec } = require('shelljs')

exec('npm start', {
  cwd: __dirname
})
