const request = require('request-promise');
const { listen, mockDb } = require('./utils');

jest.mock('flat-file-db', () => mockDb);
const db = require('../src/db');
const service = require('../src/handler');
let url;

beforeAll(() => {
  db.initDbAdapter({ adapter: 'flat-file-db' });
});

beforeEach(async () => {
  url = await listen(service({ adapter: 'flat-file-db' }));
  mockDb._setDelay(10);
});

afterEach(async () => {
  mockDb._reset();
  mockDb._setDelay();
});

it('should atomically set two views coming in at the same time', async () => {
  // Request twice at the same time
  // NOTE: These two requests will return a wrong view count, they'll both say it's 1
  request(`${url}/path`);
  request(`${url}/path`);
  // After the data is persisted (in the mocked case after 10ms) the path shows the right view count
  setTimeout(async () => {
    const body = JSON.parse(await request(`${url}/path`));
    expect(body.views).toEqual(3);
  }, 10);
});
