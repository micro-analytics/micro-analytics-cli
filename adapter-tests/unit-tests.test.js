const { mockDb } = require('../tests/utils');

jest.mock('flat-file-db', () => mockDb);

const test = require('./unit-tests');

test({
  name: 'flat-file-db',
  modulePath: 'micro-analytics-adapter-flat-file-db',
  beforeEach: async () => {
    mockDb._reset();
  },
});
