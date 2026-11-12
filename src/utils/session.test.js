import { getToken } from 'next-auth/jwt'
import { createRequest, createResponse } from 'node-mocks-http'
import { buildUser } from './user'
import {
  getSessionToken,
  isAuthorised,
  isAuthCookie,
  clearSessionCookies,
  clearStaffSessionCookies,
} from './session'

jest.mock('./user')

const now = Math.floor(Date.now() / 1000)

const sessionToken = (overrides = {}) => ({
  name: 'A Name',
  email: 'a.name@example.com',
  groups: ['group-a'],
  cognitoIdToken: 'id-token',
  cognitoTokenExpiresAt: now + 3600,
  ...overrides,
})

beforeEach(() => {
  jest.clearAllMocks()
  getToken.mockReset()
  getToken.mockResolvedValue(sessionToken())
  buildUser.mockReturnValue({ hasAnyPermissions: true })
})

describe('getSessionToken', () => {
  test('returns the session token', async () => {
    const token = sessionToken()
    getToken.mockResolvedValue(token)

    expect(await getSessionToken(createRequest())).toBe(token)
  })

  test('reads the session from the request, with NEXTAUTH_SECRET', async () => {
    const original = process.env.NEXTAUTH_SECRET
    const req = createRequest()

    process.env.NEXTAUTH_SECRET = 'a-secret'

    try {
      await getSessionToken(req)
    } finally {
      process.env.NEXTAUTH_SECRET = original
    }

    expect(getToken).toHaveBeenCalledWith({ req, secret: 'a-secret' })
  })

  test('returns null when there is no session', async () => {
    getToken.mockResolvedValue(null)

    expect(await getSessionToken(createRequest())).toBeNull()
  })

  test('returns null when the session has no Cognito ID token', async () => {
    getToken.mockResolvedValue(sessionToken({ cognitoIdToken: undefined }))

    expect(await getSessionToken(createRequest())).toBeNull()
  })

  test('returns null once the ID token has expired', async () => {
    getToken.mockResolvedValue(sessionToken({ cognitoTokenExpiresAt: now - 1 }))

    expect(await getSessionToken(createRequest())).toBeNull()
  })

  test('returns null when the ID token expires right now', async () => {
    jest.useFakeTimers().setSystemTime(now * 1000)

    try {
      getToken.mockResolvedValue(sessionToken({ cognitoTokenExpiresAt: now }))

      expect(await getSessionToken(createRequest())).toBeNull()
    } finally {
      jest.useRealTimers()
    }
  })

  test('does not catch errors reading the session', async () => {
    getToken.mockRejectedValue(new Error('decryption failed'))

    await expect(getSessionToken(createRequest())).rejects.toThrow(
      'decryption failed'
    )
  })
})

describe('isAuthorised', () => {
  const authorise = (withRedirect) => {
    const res = createResponse()
    const result = isAuthorised({ req: createRequest(), res }, withRedirect)

    return result.then((user) => ({ user, res }))
  }

  describe('when the session belongs to a user with permissions', () => {
    test('returns the user built from the session', async () => {
      const user = { hasAnyPermissions: true }
      buildUser.mockReturnValue(user)

      expect((await authorise(true)).user).toBe(user)
      expect(buildUser).toHaveBeenCalledWith('A Name', 'a.name@example.com', [
        'group-a',
      ])
    })

    test('does not redirect', async () => {
      const { res } = await authorise(true)

      expect(res.getHeader('Location')).toBeUndefined()
    })

    test('uses no groups when the session has none', async () => {
      getToken.mockResolvedValue(sessionToken({ groups: undefined }))

      await authorise(true)

      expect(buildUser).toHaveBeenCalledWith('A Name', 'a.name@example.com', [])
    })
  })

  describe('when there is no valid session', () => {
    beforeEach(() => {
      getToken.mockResolvedValue(null)
    })

    test('returns a falsy value without redirecting by default', async () => {
      const { user, res } = await authorise()

      expect(user).toBeFalsy()
      expect(res.getHeader('Location')).toBeUndefined()
    })

    test('redirects to the login page when asked to', async () => {
      const { user, res } = await authorise(true)

      expect(user).toBeFalsy()
      expect(res.statusCode).toBe(302)
      expect(res.getHeader('Location')).toBe('/login')
    })

    test('does not build a user', async () => {
      await authorise(true)

      expect(buildUser).not.toHaveBeenCalled()
    })
  })

  describe('when the session has expired', () => {
    test('redirects to the login page', async () => {
      getToken.mockResolvedValue(
        sessionToken({ cognitoTokenExpiresAt: now - 1 })
      )

      const { user, res } = await authorise(true)

      expect(user).toBeFalsy()
      expect(res.getHeader('Location')).toBe('/login')
    })
  })

  describe('when the session cannot be read', () => {
    test('redirects to the login page', async () => {
      const log = jest.spyOn(console, 'log').mockImplementation(() => {})
      getToken.mockRejectedValue(new Error('decryption failed'))

      const { user, res } = await authorise(true)

      expect(user).toBeFalsy()
      expect(res.getHeader('Location')).toBe('/login')
      expect(log).toHaveBeenCalledWith('decryption failed')

      log.mockRestore()
    })
  })

  describe('when the user has no permissions', () => {
    beforeEach(() => {
      buildUser.mockReturnValue({ hasAnyPermissions: false })
    })

    test('returns a falsy value without redirecting by default', async () => {
      const { user, res } = await authorise()

      expect(user).toBeFalsy()
      expect(res.getHeader('Location')).toBeUndefined()
    })

    test('redirects to the access denied page when asked to', async () => {
      const { user, res } = await authorise(true)

      expect(user).toBeFalsy()
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
    'next-auth.pkce.code_verifier',
    'next-auth.state',
    'next-auth.nonce',
  ])('matches %s', (name) => {
    expect(isAuthCookie(name)).toBe(true)
  })

  test.each(['another-cookie', 'my-next-auth.thing', 'next-auth', ''])(
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

describe('clearStaffSessionCookies', () => {
  const clear = (cookieHeader) => {
    const res = createResponse()

    clearStaffSessionCookies(
      createRequest({ headers: cookieHeader ? { Cookie: cookieHeader } : {} }),
      res
    )

    return res.getHeader('Set-Cookie')
  }

  test('expires every auth cookie, including chunked session cookies', () => {
    const cookies = clear(
      'next-auth.session-token.0=a; next-auth.session-token.1=b; next-auth.callback-url=c'
    )

    expect(cookies).toHaveLength(3)
    cookies.forEach((cookie) => {
      expect(cookie).toMatch(/=;/)
      expect(cookie).toMatch(/Path=\//)
      expect(cookie).toMatch(/Max-Age=0/)
      expect(cookie).toMatch(/Expires=Thu, 01 Jan 1970/)
      expect(cookie).toMatch(/HttpOnly/)
    })
  })

  test('leaves other cookies alone', () => {
    const cookies = clear('another-cookie=a; next-auth.state=b')

    expect(cookies).toHaveLength(1)
    expect(cookies[0]).toMatch(/^next-auth\.state=;/)
  })

  test.each([
    '__Secure-next-auth.session-token',
    '__Host-next-auth.csrf-token',
  ])('marks %s as Secure', (name) => {
    expect(clear(`${name}=a`)[0]).toMatch(/Secure/)
  })

  test('does not mark plain cookies as Secure', () => {
    expect(clear('next-auth.session-token=a')[0]).not.toMatch(/Secure/)
  })

  test.each([undefined, 'another-cookie=a'])(
    'sets no cookies when there are no auth cookies (%s)',
    (cookieHeader) => {
      expect(clear(cookieHeader)).toEqual([])
    }
  )
})
