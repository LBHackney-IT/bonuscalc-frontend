import { StatusCodes } from 'http-status-codes'
import { cognitoLogoutUrl } from '@/utils/cognito'
import { clearStaffSessionCookies } from '@/utils/session'

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

  clearStaffSessionCookies(req, res)
  res.redirect(logoutUrl)
}
