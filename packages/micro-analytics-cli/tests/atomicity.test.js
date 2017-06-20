const request = require('request-promise');
const { listen } = require('./utils');

const db = require('../src/db');
const service = require('../src/handler');
let server;

beforeAll(() => {
  db.initDbAdapter({ adapter: 'memory' });
});

beforeAll(async () => {
  server = await listen(service({ adapter: 'memory' }));
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  db.clear();
});

it('should atomically set two views coming in at the same time', async () => {
  // Request twice at the same time
  // NOTE: These two requests will return a wrong view count, they'll both say it's 1
  request(`${server.url}/path`);
  request(`${server.url}/path`);
  // After the data is persisted (in the mocked case after 10ms) the path shows the right view count
  setTimeout(async () => {
    const body = JSON.parse(await request(`${server.url}/path`));
    expect(body.views).toEqual(3);
  }, 10);
});
