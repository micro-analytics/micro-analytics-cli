jest.mock('pkginfo', () => () => ({version: '1.0.0'}))
const parseArgs = require('../src/parseArgs')

describe('parseArgs', () => {
  it("should have correct defaults", () => {
    expect(parseArgs(['node', 'micro-analytics'])).toMatchSnapshot();
  })

  it('should throw on non existing adapter', () => {
    expect(() => {
      parseArgs(['node', 'micro-analytics', '-a', 'not-a-real-adapter'])
    }).toThrowErrorMatchingSnapshot()
  });

  it("should use DB_ADAPTER environment variable as default if set", () => {
    process.env.DB_ADAPTER = 'memory'
    expect(parseArgs(['node', 'micro-analytics']).adapter).toEqual('memory');
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

  it('should use get adapter option when using -a', () => {
    process.env.DB_ADAPTER = 'redis'
    const args = ['node', 'micro-analytics', '-a', 'flat-file-db']
    expect(Object.keys(parseArgs(args))).toContain('dbName');
    delete process.env.DB_ADAPTER
  });

  it('should use get adapter option when using --adapter', () => {
    process.env.DB_ADAPTER = 'redis'
    const args = ['node', 'micro-analytics', '--adapter', 'flat-file-db']
    expect(Object.keys(parseArgs(args))).toContain('dbName');
    delete process.env.DB_ADAPTER
  });

  it('should use get adapter option when using --adapter=', () => {
    process.env.DB_ADAPTER = 'redis'
    const args = ['node', 'micro-analytics', '--adapter=flat-file-db']
    expect(Object.keys(parseArgs(args))).toContain('dbName');
    delete process.env.DB_ADAPTER
  });
})
