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
export const scrubAuthCookies = (event) => {
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
