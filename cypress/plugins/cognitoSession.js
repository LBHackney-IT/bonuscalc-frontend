const { createPublicKey, verify } = require('node:crypto')
const { encode } = require('next-auth/jwt')
// ESM, loaded with require (Node 22.12 or later)
const { parseCognitoGroups } = require('../../src/utils/cognito')
const { cookieName } = require('./sessionCookie')

// A real Cognito sign-in for the e2e tests: a test user in a separate pool,
// with a password, signed in directly (no hosted UI or Google). The app client
// must be public with ALLOW_USER_PASSWORD_AUTH. These stay in the Node
// process: they are never passed to the browser, so don't use Cypress.env or a
// CYPRESS_ prefix.
const VARIABLES = [
  'COGNITO_E2E_ISSUER',
  'COGNITO_E2E_CLIENT_ID',
  'COGNITO_E2E_USERNAME',
  'COGNITO_E2E_PASSWORD',
]

const SESSION_MAX_AGE = 4 * 60 * 60

// Names every missing variable at once, so one failure says what to set
const assertConfigured = () => {
  const missing = VARIABLES.filter((name) => !process.env[name]?.trim())

  if (missing.length) {
    throw new Error(
      `Set ${missing.join(', ')} to sign in as the Cognito test user (see the README)`
    )
  }
}

const requiredEnvironment = (name) => {
  const value = process.env[name]?.trim()

  if (!value) throw new Error(`${name} must be set to sign in to Cognito`)

  return value
}

// What the usual InitiateAuth errors mean for this setup
const SIGN_IN_HINTS = {
  ResourceNotFoundException:
    'Cognito has no app client with COGNITO_E2E_CLIENT_ID in the pool and region of COGNITO_E2E_ISSUER. Check the client id, and that the issuer is https://cognito-idp.<region>.amazonaws.com/<pool id> for the same pool',
  NotAuthorizedException:
    'wrong username or password, or the app client has a secret (it must be a public client)',
  UserNotFoundException: 'no user with that username in the pool',
  UserNotConfirmedException: 'the test user is not confirmed',
  PasswordResetRequiredException: 'the test user must reset their password',
  InvalidParameterException:
    'the app client does not allow the USER_PASSWORD_AUTH flow',
}

const decodeSegment = (segment) =>
  JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'))

const requestIdToken = async (issuer, clientId) => {
  let response

  try {
    response = await fetch(new URL(issuer).origin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      },
      body: JSON.stringify({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
          USERNAME: requiredEnvironment('COGNITO_E2E_USERNAME'),
          PASSWORD: requiredEnvironment('COGNITO_E2E_PASSWORD'),
        },
      }),
    })
  } catch (error) {
    throw new Error(`Cannot reach Cognito at ${issuer}: ${error.message}`)
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    const type = result.__type ?? response.status
    const hint = SIGN_IN_HINTS[type] ? ` (${SIGN_IN_HINTS[type]})` : ''

    // Never include the request: it holds the password
    throw new Error(`Cognito sign-in failed: ${type}${hint}`)
  }

  if (result.ChallengeName) {
    throw new Error(
      `The Cognito test user needs an unsupported challenge: ${result.ChallengeName}`
    )
  }

  const idToken = result.AuthenticationResult?.IdToken

  if (!idToken) throw new Error('Cognito sign-in returned no id token')

  return idToken
}

// The signature, issuer, audience, token type and expiry, like a real consumer
// of the token would check
const verifyIdToken = async (idToken, issuer, clientId) => {
  const [header, payload, signature] = idToken.split('.')
  const { alg, kid } = decodeSegment(header)

  if (alg !== 'RS256' || !kid) {
    throw new Error('The Cognito id token is not signed with RS256')
  }

  const keysResponse = await fetch(`${issuer}/.well-known/jwks.json`)

  if (!keysResponse.ok) {
    throw new Error('Unable to load the Cognito signing keys')
  }

  const { keys } = await keysResponse.json()
  const jwk = keys?.find((key) => key.kid === kid)

  if (!jwk) throw new Error('The Cognito id token signing key was not found')

  const signatureValid = verify(
    'RSA-SHA256',
    Buffer.from(`${header}.${payload}`),
    createPublicKey({ key: jwk, format: 'jwk' }),
    Buffer.from(signature, 'base64url')
  )
  const claims = decodeSegment(payload)

  if (!signatureValid) {
    throw new Error('The Cognito id token signature is invalid')
  }
  if (claims.iss !== issuer) {
    throw new Error('The Cognito id token issuer differs')
  }
  if (claims.aud !== clientId) {
    throw new Error('The Cognito id token audience differs')
  }
  if (claims.token_use !== 'id') {
    throw new Error('The Cognito token is not an id token')
  }
  if (claims.exp * 1000 <= Date.now()) {
    throw new Error('The Cognito id token has expired')
  }

  return claims
}

// What the `jwt` callback in src/utils/authOptions.js stores on sign in. Kept in
// step with it by a unit test (tests/cypress/cognitoSession.test.js), because
// the callback can't be loaded into the Cypress Node process.
const buildSessionToken = (idToken, claims) => ({
  sub: claims.sub,
  name: claims.name ?? claims.email,
  email: claims.email,
  groups: parseCognitoGroups(claims['custom:groups']),
  cognitoIdToken: idToken,
  cognitoTokenExpiresAt: claims.exp,
})

// The session cookie the app would have after a Cognito sign-in: the real id
// token, mapped to the session, then encrypted with the app's secret.
const signRealCognitoSession = async () => {
  assertConfigured()

  const secret = process.env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error('NEXTAUTH_SECRET must be set to sign a session cookie')
  }

  const issuer = requiredEnvironment('COGNITO_E2E_ISSUER')
  const clientId = requiredEnvironment('COGNITO_E2E_CLIENT_ID')
  const idToken = await requestIdToken(issuer, clientId)
  const claims = await verifyIdToken(idToken, issuer, clientId)
  const token = buildSessionToken(idToken, claims)

  const value = await encode({ secret, maxAge: SESSION_MAX_AGE, token })

  return {
    name: cookieName(process.env),
    value,
    groups: token.groups,
    expiresAt: token.cognitoTokenExpiresAt,
  }
}

module.exports = { signRealCognitoSession, buildSessionToken }
