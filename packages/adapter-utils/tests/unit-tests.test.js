const { mockDb } = require('micro-analytics-cli/tests/utils');

jest.mock('flat-file-db', () => mockDb);

const test = require('../src/unit-tests');

test({
  name: 'flat-file-db',
  modulePath: 'micro-analytics-adapter-flat-file-db',
  beforeEach: async () => {
    mockDb._reset();
  },
});
