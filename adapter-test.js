#!/usr/bin/env node
const path = require('path')
const { exec, mkdir, pushd, popd, rm } = require('shelljs')

/**
 * NOTE (@mxstbr): This is super hacky.
 *
 * Due to a bug upstream in jest-haste-map no tests that contain node_modules anywhere in their path
 * can be run, not even explicitly. When this is installed the tests we want to run are in
 * node_modules/micro-analytics-cli/tests/ — see the problem?
 *
 * We circumvent this bug by npm linking the adapter, cloning the whole micro-analytics project to
 * /tmp/, installing the dependencies, running the tests with the adapter and then deleting the
 * temp folder again.
 *
 * I know, I know. I really want to ship this though. (16th January, '17)
 */
const TMP_PATH = '/tmp/micro-analytics-adapter-test-suite'

module.exports = (adapter) => {
  exec('npm link')
  exec('git clone https://github.com/mxstbr/micro-analytics ' + TMP_PATH, () => {
    pushd(TMP_PATH)
    exec('npm install', () => {
      exec('DB_ADAPTER=' + adapter + ' npm t', () => {
        popd()
        rm('-rf', TMP_PATH)
      })
    })
  })
}
