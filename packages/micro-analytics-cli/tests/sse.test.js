const { listen } = require('./utils');
const db = require('../src/db');
const sseHandler = require('../src/sse');
let url;

beforeAll(() => {
  db.initDbAdapter({ adapter: 'memory' });
});

beforeEach(() => {
  db.clear();
});

describe('sse', () => {
  it('should publish events', () => {
    const sendMock = jest.fn();
    const eventListenerMock = jest.fn();
    sseHandler({ send: sendMock, on: eventListenerMock });

    db.put('superview', { views: [{ time: 1490432584312 }] });

    expect(sendMock).toHaveBeenCalled();
  });

  it('should publish events with correct structure', () => {
    const sendMock = jest.fn();
    const eventListenerMock = jest.fn();
    sseHandler({ send: sendMock, on: eventListenerMock });

    db.put('superview', { views: [{ time: 1490432584312 }] });

    expect(sendMock.mock.calls).toMatchSnapshot();
  });
});
