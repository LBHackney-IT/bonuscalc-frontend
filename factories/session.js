// Builds a cookie that the mocked `getToken` in setupTests.js understands.
// The real next-auth cookie is encrypted, which isn't useful to unit tests.
export const SESSION_COOKIE_NAME = 'next-auth.session-token'

export const sessionCookie = ({ name, email, groups, expiresAt }) => {
  const claims = {
    name,
    email,
    groups,
    cognitoIdToken: 'test-cognito-id-token',
    cognitoTokenExpiresAt: expiresAt ?? Math.floor(Date.now() / 1000) + 3600,
  }

  const value = Buffer.from(JSON.stringify(claims)).toString('base64')

  return `${SESSION_COOKIE_NAME}=${value}`
}
