const { queryToObject } = require('../src/utils')

describe('utils', () => {
  it("queryToObject should convert string into object", () => {
    expect(queryToObject('k:v,k2:v2')).toMatchSnapshot()
  })
})
