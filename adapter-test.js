#!/usr/bin/env node
const path = require('path')
const { exec } = require('shelljs')

module.exports = (adapter) => {
  console.log('Installing dependencies...')
  exec('npm i', { cwd: __dirname, silent: true }, (exitCode, _, stderr) => {
    const isError = exitCode > 0
    if (isError) {
      console.error(stderr)
      return
    }
    console.log('Dependencies installed!')
    const test = exec('TEST_DB_ADAPTER=' + path.join(process.cwd(), adapter) + ' npm run adapter-test', { async: true, cwd: __dirname })
  })
}
