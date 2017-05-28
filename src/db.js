const promise = require('promise')

function initDbAdapter(options) {
  const adapterName = options.adapter
  const adapter = require(`micro-analytics-adapter-${adapterName}`)

  module.exports.get = adapter.get
  module.exports.getAll = adapter.getAll
  module.exports.put = adapter.put
  module.exports.has = adapter.has
  module.exports.keys = adapter.keys
  module.exports.subscribe = adapter.subscribe
  module.exports.hasFeature = feature => typeof adapter[feature] === 'function'

  if (module.exports.hasFeature('init')) {
    adapter.init(options)
  }
}

module.exports = {
  initDbAdapter: initDbAdapter,
  hasFeature: feature => false
}
