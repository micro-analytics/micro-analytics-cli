const micro = require('micro')
const SSE = require('sse')

const handler = require('./handler')
const sseHandler = require('./sse')

const server = micro(handler)
const sse = new SSE(server)
sse.on('connection', sseHandler)

server.listen(3000)
