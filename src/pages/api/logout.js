import cookie from 'cookie'
import { StatusCodes } from 'http-status-codes'
import { cognitoLogoutUrl } from '@/utils/cognito'
import { isAuthCookie } from '@/utils/session'

const { METHOD_NOT_ALLOWED, INTERNAL_SERVER_ERROR } = StatusCodes

// Clears the next-auth cookies then ends the Cognito session, which sends the
// browser back to /login.
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(METHOD_NOT_ALLOWED).end()
  }

  const logoutUrl = cognitoLogoutUrl()

  if (!logoutUrl) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ title: 'Cognito logout is not configured' })
  }

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
  res.redirect(logoutUrl)
}
