const promise = require('promise')

let adapter
const adapterName = process.env.TEST_DB_ADAPTER || `micro-analytics-adapter-${process.env.DB_ADAPTER || 'flat-file-db'}`

const repeatCharacter = (char, n) => `${Array(n + 1).join(char)}`

try {
  adapter = require(adapterName)
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    // Console.error a warning message, but normally exit the process to avoid printing ugly npm ERR lines and stack trace.
    console.error(`\n${repeatCharacter(' ', 22)}⚠️ ERROR ⚠️\n${repeatCharacter('-', 55)}\nYou specified "${process.env.DB_ADAPTER}" as the DB_ADAPTER, but no package\ncalled "${adapterName}" was found.\n\nPlease make sure you spelled the name correctly and\nhave "npm install"ed the necessary adapter package!\n${repeatCharacter('-', 55)}\n`)
    process.exit(0)
  } else {
    throw err
  }
}

module.exports = {
  get: adapter.get,
  getAll: adapter.getAll,
  put: adapter.put,
  has: adapter.has,
  keys: adapter.keys,
}
