import { isAuthorised, isAuthCookie, clearSessionCookies } from './session'
import { createRequest, createResponse } from 'node-mocks-http'
import { sessionCookie } from 'factories/session'

const { OPERATIVE_MANAGERS_GOOGLE_GROUPNAME, WEEK_MANAGERS_GOOGLE_GROUPNAME } =
  process.env

const claims = {
  name: 'name',
  email: 'name@example.com',
  groups: [OPERATIVE_MANAGERS_GOOGLE_GROUPNAME, WEEK_MANAGERS_GOOGLE_GROUPNAME],
}

describe('isAuthorised', () => {
  describe('when the request contains a valid session', () => {
    const req = createRequest({ headers: { Cookie: sessionCookie(claims) } })
    const res = createResponse()

    test('returns a user object with relevant fields and permissions', async () => {
      const user = await isAuthorised({ req, res })

      expect(user).toMatchObject({
        name: 'name',
        email: 'name@example.com',
        hasOperativeManagerPermissions: true,
        hasWeekManagerPermissions: true,
        hasAnyPermissions: true,
      })
    })
  })

  describe('when the request has no session', () => {
    const req = createRequest()

    test('returns a falsy value without redirecting', async () => {
      const res = createResponse()

      expect(await isAuthorised({ req, res })).toBeFalsy()
      expect(res.statusCode).toBe(200)
    })

    test('redirects to the login page when asked to', async () => {
      const res = createResponse()

      await isAuthorised({ req, res }, true)

      expect(res.statusCode).toBe(302)
      expect(res.getHeader('Location')).toBe('/login')
    })
  })

  describe('when the Cognito ID token has expired', () => {
    const expiresAt = Math.floor(Date.now() / 1000) - 60
    const req = createRequest({
      headers: { Cookie: sessionCookie({ ...claims, expiresAt }) },
    })

    test('redirects to the login page', async () => {
      const res = createResponse()

      expect(await isAuthorised({ req, res }, true)).toBeFalsy()
      expect(res.getHeader('Location')).toBe('/login')
    })
  })

  describe('when the user is not in a recognised group', () => {
    const req = createRequest({
      headers: { Cookie: sessionCookie({ ...claims, groups: ['other'] }) },
    })

    test('redirects to the access denied page', async () => {
      const res = createResponse()

      expect(await isAuthorised({ req, res }, true)).toBeFalsy()
      expect(res.statusCode).toBe(302)
      expect(res.getHeader('Location')).toBe('/access-denied')
    })
  })
})

describe('isAuthCookie', () => {
  test.each([
    'next-auth.session-token',
    'next-auth.session-token.0',
    '__Secure-next-auth.session-token',
    '__Secure-next-auth.callback-url',
    '__Host-next-auth.csrf-token',
  ])('matches %s', (name) => {
    expect(isAuthCookie(name)).toBe(true)
  })

  test.each(['another-cookie', 'my-next-auth.thing'])(
    'does not match %s',
    (name) => {
      expect(isAuthCookie(name)).toBe(false)
    }
  )
})

describe('clearSessionCookies', () => {
  test('removes auth cookie values and leaves the rest', () => {
    const event = {
      request: {
        cookies: {
          'next-auth.session-token': 'secret',
          'another-cookie': 'value',
        },
      },
    }

    expect(clearSessionCookies(event).request.cookies).toEqual({
      'next-auth.session-token': '[REMOVED]',
      'another-cookie': 'value',
    })
  })

  test('copes with an event that has no cookies', () => {
    expect(clearSessionCookies({})).toEqual({})
  })
})
