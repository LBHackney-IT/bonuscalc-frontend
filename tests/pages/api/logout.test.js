import { createRequest, createResponse } from 'node-mocks-http'
import logout from '@/root/src/pages/api/logout'

describe('Signing out', () => {
  const original = { ...process.env }

  beforeEach(() => {
    process.env.COGNITO_DOMAIN = 'auth.example.com'
    process.env.COGNITO_CLIENT_ID = 'client-id'
    process.env.NEXTAUTH_URL = 'https://app.example.com'
  })

  afterEach(() => {
    process.env = { ...original }
  })

  test('clears the auth cookies and redirects to Cognito', () => {
    const req = createRequest({
      method: 'GET',
      headers: {
        Cookie:
          '__Secure-next-auth.session-token=abc; next-auth.csrf-token=def; another-cookie=ghi',
      },
    })
    const res = createResponse()

    logout(req, res)

    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toMatch(
      /^https:\/\/auth\.example\.com\/logout\?client_id=client-id/
    )

    const cookies = res.getHeader('Set-Cookie')

    expect(cookies).toHaveLength(2)
    expect(cookies[0]).toMatch(/^__Secure-next-auth\.session-token=;.*Secure/)
    expect(cookies[1]).toMatch(/^next-auth\.csrf-token=;/)
  })

  test('only allows GET', () => {
    const res = createResponse()

    logout(createRequest({ method: 'POST' }), res)

    expect(res.statusCode).toBe(405)
  })

  test('fails when Cognito is not configured', () => {
    delete process.env.COGNITO_DOMAIN
    const res = createResponse()

    logout(createRequest({ method: 'GET' }), res)

    expect(res.statusCode).toBe(500)
  })
})
