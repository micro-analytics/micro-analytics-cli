// Atomic view pushing method, can safely be called multiple times without the
// db messing up.
const pushView = async (key, view) => {
  const db = require('./db')
  const locks = {}
  await push()

  async function push() {
    if (locks[key]) return setImmediate(async () => { await push() })
    locks[key] = true

    const views = db.has(key)
      ? db.get(key).views
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

// do redis requests need to be atomic ??
const pushRedis = async (key, view) => {
  const redisDB = require('./redis')
  const viewData = await redisDB.get(key)
  const views = viewData ? viewData.views : []

  return redisDB.put(key, { views: views.concat([view]) })
}

module.exports = exports
exports.pushView = pushView
exports.pushRedis = pushRedis
