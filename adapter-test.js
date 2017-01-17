#!/usr/bin/env node
const path = require('path')
const ora = require('ora')
const { exec } = require('shelljs')

module.exports = (adapter) => {
  const spinner = ora('Installing dependencies').start()
  exec('npm i', { cwd: __dirname, silent: true }, (exitCode, _, stderr) => {
    const isError = exitCode > 0
    if (isError) {
      spinner.stopAndPersist('✖')
      console.error(stderr)
      return
    }
    spinner.stopAndPersist('✔')
    const test = exec('TEST_DB_ADAPTER=' + path.join(process.cwd(), adapter) + ' npm run adapter-test', { async: true, cwd: __dirname })
  })
}
