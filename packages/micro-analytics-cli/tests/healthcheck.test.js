const request = require('request-promise');

const db = require('../src/db');
const { listen } = require('./utils');

let mockStatus = 'ok';
jest.mock('micro-analytics-adapter-flat-file-db', () => ({
  version: '42.0.0',
  subscribe: () => {},
  healthcheck: async () => {
    await new Promise(resolve => setTimeout(resolve, 20));
    return mockStatus;
  },
}));

jest.mock('micro-analytics-adapter-memory', () => ({
  version: '42.0.0',
}));

const service = require('../src/handler')({ adapter: 'flat-file-db' });

let server;

beforeAll(async () => {
  db.initDbAdapter({ adapter: 'flat-file-db' });
  server = await listen(service);
});

afterAll(() => {
  server.close();
});

test('GET /_healtcheck adapter healthcheck returns "ok"', async () => {
  mockStatus = 'ok';
  const body = JSON.parse(await request(`${server.url}/_healthcheck`));

  expect(body).toMatchObject({
    health: 'ok',
    adapter: {
      name: 'flat-file-db',
      version: '42.0.0',
      features: {
        realtime: true,
      },
    },
  });
});

test('GET /_healtcheck adapter healthcheck returns "critical"', async () => {
  mockStatus = 'critical';
  let error;

  try {
    const body = JSON.parse(await request(`${server.url}/_healthcheck`));
  } catch (e) {
    error = e;
  }

  expect(error.statusCode).toEqual(500);
  expect(JSON.parse(error.error)).toMatchObject({
    health: 'critical',
    adapter: {
      name: 'flat-file-db',
      version: '42.0.0',
      features: {
        realtime: true,
      },
    },
  });
});

test('GET /_healtcheck when adapter has no healthcheck', async () => {
  let error;
  const { url, close } = await listen(require('../src/handler')({ adapter: 'memory' }));
  db.initDbAdapter({ adapter: 'memory' });

  try {
    const body = JSON.parse(await request(`${url}/_healthcheck`));
  } catch (e) {
    error = e;
  }

  close();

  expect(error.statusCode).toEqual(500);
  expect(JSON.parse(error.error)).toMatchObject({
    health: 'unknown',
    adapter: {
      name: 'memory',
      version: '42.0.0',
      features: {
        realtime: false,
      },
    },
  });
});
