jest.mock('pkginfo', () => () => ({version: '1.0.0'}))
const parseArgs = require('../src/parseArgs')


describe('parseArgs', () => {
  it("should have correct defaults", () => {
    expect(parseArgs(['node', 'micro-analytics'])).toMatchSnapshot();
  })

  it("should use DB_ADAPTER environment variable as default if set", () => {
    process.env.DB_ADAPTER = 'redis'
    expect(parseArgs(['node', 'micro-analytics']).adapter).toEqual('redis');
    delete process.env.DB_ADAPTER
  })

  it("should use PORT environment variable as default if set", () => {
    process.env.PORT = '3000'
    expect(parseArgs(['node', 'micro-analytics']).port).toEqual(3000);
    delete process.env.PORT
  })

  it("should use HOST environment variable as default if set", () => {
    process.env.HOST = 'localhost'
    expect(parseArgs(['node', 'micro-analytics']).host).toEqual('localhost');
    delete process.env.HOST
  })
})
