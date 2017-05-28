const db = require('./db')

module.exports = function handleSseConnection(connection) {
  const subscription = db.subscribe(event => {
    connection.send({
      event: 'micro-analytics-ping',
      data: JSON.stringify(event)
    })
  })

  connection.on('close', function() {
    subscription.unsubscribe()
  })
}
