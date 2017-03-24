const promise = require('promise')

function initDbAdapter(adapterName) {
  let adapter
  const repeatCharacter = (char, n) => `${Array(n + 1).join(char)}`

  try {
    adapter = require(`micro-analytics-adapter-${adapterName}`)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      // Console.error a warning message, but normally exit the process to avoid printing ugly npm ERR lines and stack trace.
      console.error(`\n${repeatCharacter(' ', 22)}⚠️ ERROR ⚠️\n${repeatCharacter('-', 55)}\nYou specified "${adapterName}" as the DB_ADAPTER, but no package\ncalled "micro-analytics-adapter-${adapterName}" was found.\n\nPlease make sure you spelled the name correctly and\nhave "npm install"ed the necessary adapter package!\n${repeatCharacter('-', 55)}\n`)
      process.exit(0)
    } else {
      throw err
    }
  }


  module.exports.get = adapter.get;
  module.exports.getAll = adapter.getAll;
  module.exports.put = adapter.put;
  module.exports.has = adapter.has;
  module.exports.keys = adapter.keys;
  module.exports.subscribe = adapter.subscribe;
  module.exports.hasFeature = (feature) => typeof adapter[feature] === "function";

}

module.exports = {
  initDbAdapter: initDbAdapter,
  hasFeature: (feature) => false,
}
