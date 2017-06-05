const path = require('path');
const test = require('micro-analytics-adapter-utils/unit-tests');

const adapter = require('./index');

test({
  name: 'flat-file-db',
  modulePath: path.resolve(__dirname, './index.js'),
  beforeAll: () => {
    adapter.init({ dbName: 'views.db' });
  },
  beforeEach: () => {
    return adapter.clear();
  },
});
