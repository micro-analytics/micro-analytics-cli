const url = require('url')
const level = require('level')
const then = require('then-levelup')
const { send, createError, sendError } = require('micro')

const db = then(level('blog-views'))

module.exports = async function (req, res) {
  // Check that a blogpost is provided
  const { pathname } = url.parse(req.url)
  if (pathname.length <= 1) {
    throw createError(400, 'Please include a path to a blogpost.')
  }
  if (req.method !== 'GET') {
    throw createError(400, 'Please make a GET request.')
  }
  // Allow getting all views in one request via /_p/all
  if (/\/?_p\/all\/?/.test(pathname)) {
    const posts = []
    db.createReadStream()
      .on('data', function (data) {
        posts.push({ url: data.key, views: data.value })
      })
      .on('end', function () {
        send(res, 200, { posts })
      })
    return
  }
  try {
    const views = parseInt(await db.get(pathname), 10)
    // Increment the views and send them back to client
    await db.put(pathname, views + 1)
    send(res, 200, { views: views + 1 })
  } catch (err) {
    if (err.notFound) {
      // Initialise the post with one view
      await db.put(pathname, 1)
      send(res, 200, { views: 1 })
    } else {
      throw createError(500, 'Something went wrong, sorry about that.')
    }
  }
}
