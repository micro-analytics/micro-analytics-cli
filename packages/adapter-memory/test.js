const test = require('micro-analytics-adapter-utils/unit-tests');
const path = require('path');

const adapter = require('./index');

test({
  name: 'memory',
  modulePath: path.resolve(__dirname, './index.js'),
  beforeEach: () => {
    adapter.clear();
  },
});
