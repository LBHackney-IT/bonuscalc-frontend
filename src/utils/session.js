import cookie from 'cookie'
import { getToken } from 'next-auth/jwt'
import { buildUser } from './user'

export const AUTH_WHITELIST = ['/login', '/access-denied']

// next-auth cookies: session token (possibly chunked), csrf token, callback url
export const isAuthCookie = (name) =>
  /^(__Secure-|__Host-)?next-auth\./.test(name)

export const redirectToHome = (res) => {
  res.writeHead(302, {
    Location: '/',
  })
  res.end()
}

export const redirectToLogin = (res) => {
  res.writeHead(302, {
    Location: '/login',
  })
  res.end()
}

export const redirectToAcessDenied = (res) => {
  res.writeHead(302, {
    Location: '/access-denied',
  })
  res.end()
}

// Removes the auth cookies from the request data sent to Sentry
export const clearSessionCookies = (event) => {
  const cookies = event.request?.cookies

  if (cookies) {
    Object.keys(cookies)
      .filter(isAuthCookie)
      .forEach((name) => {
        cookies[name] = '[REMOVED]'
      })
  }

  return event
}

// Expires every next-auth cookie sent with the request
export const clearStaffSessionCookies = (req, res) => {
  const cookies = cookie.parse(req.headers.cookie ?? '')

  const expiredCookies = Object.keys(cookies)
    .filter(isAuthCookie)
    .map((name) =>
      cookie.serialize(name, '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        secure: /^__(Secure|Host)-/.test(name),
      })
    )

  res.setHeader('Set-Cookie', expiredCookies)
}

// Returns the next-auth session token, or null if it is missing, invalid or
// the Cognito ID token inside it has expired.
export const getSessionToken = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token?.cognitoIdToken) {
    return null
  }

  if (token.cognitoTokenExpiresAt * 1000 <= Date.now()) {
    return null
  }

  return token
}

export const isAuthorised = async ({ req, res }, withRedirect = false) => {
  try {
    const token = await getSessionToken(req)

    if (!token) {
      return withRedirect && redirectToLogin(res)
    }

    const { name, email, groups = [] } = token

    const user = buildUser(name, email, groups)

    if (!user.hasAnyPermissions) {
      return withRedirect && redirectToAcessDenied(res)
    }

    return user
  } catch (err) {
    console.log(err.message)
    return withRedirect && redirectToLogin(res)
  }
}
