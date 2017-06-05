const { send } = require('micro');

const pkg = require('../package.json');
const db = require('./db');

module.exports = async function healthcheckHandler(options, req, res) {
  const health = db.hasFeature('healthcheck') ? await db.healthcheck() : 'unknown';

  send(res, health === 'ok' ? 200 : 500, {
    health,
    version: pkg.version,
    adapter: {
      name: options.adapter,
      version: db.version,
      features: {
        realtime: db.hasFeature('subscribe'),
      },
    },
  });
};
