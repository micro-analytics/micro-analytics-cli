const request = require('request-promise');
const { listen } = require('./utils');

const db = require('../src/db');
const service = require('../src/handler');
let server;

beforeAll(async () => {
  db.initDbAdapter({ adapter: 'memory' });
  server = await listen(service({ adapter: 'memory' }));
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  db.clear();
});

describe('single', () => {
  it('should set the views of a non-existant path to one', async () => {
    const body = JSON.parse(await request(`${server.url}/nonexistant`));
    expect(body.views).toEqual(1);
  });

  it('should increment the views of an existant path', async () => {
    await request(`${server.url}/existant`);
    const body = JSON.parse(await request(`${server.url}/existant`));
    expect(body.views).toEqual(2);
  });

  it('should return 0 views on a non-existant path if inc is set to false', async () => {
    const body = JSON.parse(await request(`${server.url}/path?inc=false`));
    expect(body.views).toEqual(0);
  });

  it('should not increment the views of an existant path if inc is set to false', async () => {
    await request(`${server.url}/existant`);
    const body = JSON.parse(await request(`${server.url}/existant?inc=false`));
    expect(body.views).toEqual(1);
  });

  it('should not return anything for a POST request', async () => {
    const body = await request.post(`${server.url}/existant`);
    expect(body).toEqual('');
  });
});

describe('all', () => {
  it('should return an empty array if no previous views exist', async () => {
    const body = JSON.parse(await request(`${server.url}/?all=true`));
    expect(body.data).toEqual({});
    expect(body.time).toBeDefined();
  });

  it('should return previous views of one route', async () => {
    await request(`${server.url}/route`);
    await request(`${server.url}/route`);
    const body = JSON.parse(await request(`${server.url}/?all=true`));
    expect(Object.keys(body.data).length).toBe(1);
    expect(body.data['/route'].views).toBeDefined();
    expect(body.data['/route'].views.length).toBe(2);
  });

  it('should return previous views of all routes', async () => {
    await request(`${server.url}/route`);
    await request(`${server.url}/route`);
    await request(`${server.url}/route2`);
    await request(`${server.url}/route2`);
    await request(`${server.url}/route2`);
    const body = JSON.parse(await request(`${server.url}/?all=true`));
    expect(Object.keys(body.data).length).toBe(2);
    expect(body.data['/route'].views).toBeDefined();
    expect(body.data['/route'].views.length).toBe(2);
    expect(body.data['/route2'].views).toBeDefined();
    expect(body.data['/route2'].views.length).toBe(3);
  });

  describe('filtering', () => {
    it('should filter based on pathname', async () => {
      await request(`${server.url}/rover`);
      await request(`${server.url}/route`);
      const body = JSON.parse(await request(`${server.url}/rover?all=true`));
      expect(Object.keys(body.data).length).toBe(1);
      expect(body.data['/rover'].views).toBeDefined();
      expect(body.data['/rover'].views.length).toBe(1);
    });

    it('should filter based on starting with pathname', async () => {
      await request(`${server.url}/rover`);
      await request(`${server.url}/rover2`);
      await request(`${server.url}/route`);
      const body = JSON.parse(await request(`${server.url}/rover?all=true`));
      expect(Object.keys(body.data).length).toBe(2);
      expect(body.data['/rover'].views).toBeDefined();
      expect(body.data['/rover'].views.length).toBe(1);
      expect(body.data['/rover2'].views).toBeDefined();
      expect(body.data['/rover2'].views.length).toBe(1);
    });

    it('should filter based on before after', async () => {
      const after = new Date('2017-01-01T09:11:00.000Z').getTime();
      const before = new Date('2017-01-01T09:41:00.000Z').getTime();

      await db.put('/rover', {
        views: [
          { time: new Date('2017-01-01T09:00:00.000Z').getTime() },
          { time: new Date('2017-01-01T09:10:00.000Z').getTime() },
          { time: new Date('2017-01-01T09:20:00.000Z').getTime() },
          { time: new Date('2017-01-01T09:30:00.000Z').getTime() },
          { time: new Date('2017-01-01T09:40:00.000Z').getTime() },
          { time: new Date('2017-01-01T09:50:00.000Z').getTime() },
        ],
      });

      const mapToIsoString = view => new Date(view.time).toISOString();
      const body = JSON.parse(
        await request(`${server.url}/rover?all=true&before=${before}&after=${after}`)
      );
      expect(body.data['/rover'].views.map(mapToIsoString)).toEqual([
        '2017-01-01T09:20:00.000Z',
        '2017-01-01T09:30:00.000Z',
        '2017-01-01T09:40:00.000Z',
      ]);
    });
  });
});
