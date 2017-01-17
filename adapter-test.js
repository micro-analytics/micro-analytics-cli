#!/usr/bin/env node
const path = require('path')
const { exec } = require('shelljs')

module.exports = (adapter) => {
  exec('DB_ADAPTER=' + adapter + ' npm t', { async: true })
}
