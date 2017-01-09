const url = require('url')
const level = require('level')
const then = require('then-levelup')
const { send, createError, sendError } = require('micro')

const db = then(level('blog-views', {
  keyEncoding: 'json',
  valueEncoding: 'json'
}))

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
    const { views } = await db.get(pathname)
    // Add a view and send the total views back to the client
    if (shouldIncrement) {
      views.push({ time: Date.now() })
      await db.put(pathname, { views })
    }
    if (req.method === 'GET') {
      send(res, 200, { views: views.length })
    } else {
      send(res, 200)
    }
  } catch (err) {
    if (err.notFound) {
      // Initialise the page with one view
      if (shouldIncrement) {
        await db.put(pathname, { views: [{ time: Date.now() }] })
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
