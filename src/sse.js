const db = require('./db')

module.exports = function handleSseConnection(connection) {
  console.log('new connection')
  const subscription = db.subscribe((event) => {
  console.log('new event', event)
    connection.send({
      event: 'new-event',
      data: JSON.stringify(event),
    })
  })

  connection.on('close', function () {
    console.log('closing connection')
    subscription.unsubscribe()
  })
}
