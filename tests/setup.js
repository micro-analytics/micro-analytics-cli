require('babel-register')({
  presets: [['env', {
    targets: {
      node: 'current'
    }
  }]]
})

const sinon = require('sinon')
const { mockDb } = require('./utils')
sinon.stub(require('flat-file-db'), 'sync', mockDb.sync)
