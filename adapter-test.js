#!/usr/bin/env node
const { exec } = require('shelljs')

module.exports = (adapter) => {
  exec('DB_ADAPTER=' + adapter + ' npm t', { cwd: __dirname })
}
