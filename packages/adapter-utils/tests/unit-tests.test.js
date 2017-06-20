const adapter = require('micro-analytics-adapter-memory');
const test = require('../src/unit-tests');

test({
  name: 'memory',
  modulePath: 'micro-analytics-adapter-memory',
  beforeEach: () => {
    adapter.clear();
  },
});
