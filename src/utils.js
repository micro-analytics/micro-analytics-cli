const db = require('./db')

// Atomic view pushing method, can safely be called multiple times without the
// db messing up.
const pushView = async (key, view) => {
  const locks = {}
  await push()

  async function push() {
    if (locks[key]) return setImmediate(async () => { await push() })
    locks[key] = true

    const views = await db.has(key)
      ? (await db.get(key)).views
      : []

    try {
      await db.put(key, { views: views.concat([view]) })
      delete locks[key]
    } catch (err) {
      delete locks[key]
      throw err
    }
  }
}

// Transform k:v,k2:v2 into { k: v, k2: v2 }
const queryToObject = (string) => (
  string.split(',').reduce((acc, item) => {
    const [key, value] = item.split(':')
    return Object.assign({}, acc, { [key]: value })
  }, {})
)

module.exports = exports
exports.pushView = pushView
exports.queryToObject = queryToObject
