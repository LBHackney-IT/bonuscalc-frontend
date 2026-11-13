import { buildServiceHeaders } from './apiAuth'
import { createRequest } from 'node-mocks-http'

const { GSSO_TOKEN_NAME, BONUSCALC_SERVICE_API_KEY } = process.env

describe('buildServiceHeaders', () => {
  test('passes the user token as Authorization and x-hackney-user', () => {
    const req = createRequest({
      method: 'POST',
      headers: { Cookie: `${GSSO_TOKEN_NAME}=abc123;` },
    })

    expect(buildServiceHeaders(req)).toEqual({
      'x-api-key': BONUSCALC_SERVICE_API_KEY,
      'x-hackney-user': 'abc123',
      Authorization: 'abc123',
      'content-type': 'application/json',
    })
  })

  test('falls back to empty strings when there is no cookie', () => {
    const headers = buildServiceHeaders(createRequest({ method: 'POST' }))

    expect(headers['Authorization']).toBe('')
    expect(headers['x-hackney-user']).toBe('')
  })
})
