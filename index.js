const url = require('url')
const level = require('level')
const then = require('then-levelup')
const { send, createError, sendError } = require('micro')

const db = then(level('blog-views'))

module.exports = async function (req, res) {
  // Check that a page is provided
  const { pathname, query } = url.parse(req.url, /* parseQueryString */ true)
  if (pathname.length <= 1) {
    throw createError(400, 'Please include a path to a page.')
  }
  if (req.method !== 'GET' && req.method !== 'POST') {
    throw createError(400, 'Please make a GET or a POST request.')
  }
  const shouldIncrement = query.inc !== 'false' && query.inc !== false
  try {
    const views = parseInt(await db.get(pathname), 10)
    // Increment the views and send them back to client
    if (shouldIncrement) {
      await db.put(pathname, views + 1)
    }
    if (req.method === 'GET') {
      send(res, 200, { views: shouldIncrement ? views + 1 : views })
    } else {
      send(res, 200)
    }
  } catch (err) {
    if (err.notFound) {
      // Initialise the page with one view
      if (shouldIncrement) {
        await db.put(pathname, 1)
      }
      if (req.method === 'GET') {
        send(res, 200, { views: shouldIncrement ? 1 : 0 })
      } else {
        send(res, 200)
      }
    } else {
      throw createError(500, 'Internal server error.')
    }
  }
}
