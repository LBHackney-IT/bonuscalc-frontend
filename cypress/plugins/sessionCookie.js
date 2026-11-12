const { encode } = require('next-auth/jwt')

const SESSION_MAX_AGE = 4 * 60 * 60

// Which Google groups each test user belongs to. The group names come from the
// same env vars the app uses to map groups to roles.
const GROUPS_BY_USER = {
  'an.operative_manager': ['OPERATIVE_MANAGERS_GOOGLE_GROUPNAME'],
  'a.week_manager': [
    'OPERATIVE_MANAGERS_GOOGLE_GROUPNAME',
    'WEEK_MANAGERS_GOOGLE_GROUPNAME',
  ],
  'an.authorisations_manager': [
    'OPERATIVE_MANAGERS_GOOGLE_GROUPNAME',
    'AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME',
  ],
}

// Display names, as shown on band change decisions and in the header
const NAMES_BY_USER = {
  'an.operative_manager': 'An Operative Manager',
  'a.week_manager': 'A Week Manager',
  'an.authorisations_manager': 'An Authorisations Manager',
}

// `cy.login()` without a user signs in as someone who is not a week manager,
// as the previous default test user was, so that closed weeks are read only.
const DEFAULT_USER = 'an.operative_manager'

// next-auth prefixes the cookie name when the site is served over https.
const cookieName = (env) =>
  env.NEXTAUTH_URL?.startsWith('https://')
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'

// cy.task passes null when `cy.login()` is called without a user
const signSessionCookie = async (env, requestedUser) => {
  const user = requestedUser ?? DEFAULT_USER
  const secret = env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error('NEXTAUTH_SECRET must be set to sign a session cookie')
  }

  const envNames = GROUPS_BY_USER[user] ?? GROUPS_BY_USER[DEFAULT_USER]
  const groups = envNames.map((name) => env[name])

  if (groups.some((group) => !group)) {
    throw new Error(`Missing group env vars for ${user}: ${envNames}`)
  }

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE

  const value = await encode({
    secret,
    maxAge: SESSION_MAX_AGE,
    token: {
      sub: `cypress-${user}`,
      name: NAMES_BY_USER[user] ?? user,
      email: `${user}@hackney.gov.uk`,
      groups,
      cognitoIdToken: 'cypress-cognito-id-token',
      cognitoTokenExpiresAt: expiresAt,
    },
  })

  return { name: cookieName(env), value }
}

module.exports = { signSessionCookie }
