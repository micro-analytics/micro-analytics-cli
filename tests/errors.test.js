const request = require('request-promise')
const expect = require('expect')
const sinon = require('sinon')
const { listen } = require('./utils')

const service = require('../src')
let url

beforeEach(async () => {
  url = await listen(service)
})

it('should throw an error if no pathname is provided', async () => {
  const fn = sinon.spy()
  try {
    await request(url)
    fn()
  } catch (err) {
    expect(err.statusCode).toBe(400)
    expect(err.message.indexOf('include a path')).toBeGreaterThan(-1)
  }
  expect(fn.called).toEqual(false)
})

it('should throw an error if a PUT request comes in', async () => {
  const fn = sinon.spy()
  try {
    await request.put(`${url}/test`)
    expect(err.message.indexOf('make a GET or a POST request')).toBeGreaterThan(-1)
    fn()
  } catch (err) {
    expect(err.statusCode).toBe(400)
  }
  expect(fn.called).toEqual(false)
})
