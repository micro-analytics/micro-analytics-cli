const request = require('request-promise')
const { listen } = require('./utils')

const service = require('../src/handler')
const db = require('../src/db')
let url

beforeAll(() => {
  db.initDbAdapter({ adapter: 'flat-file-db' });
})

beforeEach(async () => {
  url = await listen(service)
})

it('should throw an error if no pathname is provided', async () => {
  const fn = jest.fn()
  try {
    await request(url)
    fn()
  } catch (err) {
    expect(err.statusCode).toBe(400)
    expect(err.message.indexOf('include a path')).toBeGreaterThan(-1)
  }
  expect(fn).not.toHaveBeenCalled()
})

it('should throw an error if a PUT request comes in', async () => {
  const fn = jest.fn()
  try {
    await request.put(`${url}/test`)
    expect(err.message.indexOf('make a GET or a POST request')).toBeGreaterThan(-1)
    fn()
  } catch (err) {
    expect(err.statusCode).toBe(400)
  }
  expect(fn).not.toHaveBeenCalled()
})
