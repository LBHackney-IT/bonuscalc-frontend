import { parseCognitoGroups } from '@/utils/cognito'
import { authOptions, SESSION_MAX_AGE } from './authOptions'

jest.mock('@/utils/cognito', () => ({ parseCognitoGroups: jest.fn() }))
jest.mock('next-auth/providers/cognito', () => ({
  __esModule: true,
  default: jest.fn((options) => ({ options })),
}))

const idToken = 'header.payload.signature'

const signIn = (profile, account = { id_token: idToken }) =>
  authOptions.callbacks.jwt({ token: { sub: 'old' }, account, profile })

beforeEach(() => {
  parseCognitoGroups.mockReset()
  parseCognitoGroups.mockReturnValue([])
})

describe('jwt callback', () => {
  test('stores the claims and the Cognito ID token on sign in', async () => {
    parseCognitoGroups.mockReturnValue(['group-a', 'group-b'])

    const token = await signIn({
      sub: 'abc',
      name: 'A Name',
      email: 'a.name@example.com',
      'custom:groups': 'raw groups',
      exp: 1900000000,
    })

    expect(token).toEqual({
      sub: 'abc',
      name: 'A Name',
      email: 'a.name@example.com',
      groups: ['group-a', 'group-b'],
      cognitoIdToken: idToken,
      cognitoTokenExpiresAt: 1900000000,
    })
  })

  test('reads the groups from the custom:groups claim', async () => {
    await signIn({ sub: 'abc', 'custom:groups': 'raw groups' })

    expect(parseCognitoGroups).toHaveBeenCalledWith('raw groups')
  })

  test('uses the email when there is no name', async () => {
    const token = await signIn({ sub: 'abc', email: 'a.name@example.com' })

    expect(token.name).toBe('a.name@example.com')
  })

  test('does not keep anything from the previous token', async () => {
    const token = await signIn({ sub: 'abc' })

    expect(token.sub).toBe('abc')
  })

  test.each([
    ['no ID token', { id_token: undefined }, { sub: 'abc' }],
    ['no profile', { id_token: idToken }, undefined],
    ['no subject', { id_token: idToken }, { email: 'a@example.com' }],
  ])('fails when Cognito returns %s', async (_, account, profile) => {
    await expect(signIn(profile, account)).rejects.toThrow(
      'Cognito did not return a complete ID token'
    )
  })

  test('returns the existing token when not signing in', async () => {
    const token = { sub: 'abc', cognitoIdToken: idToken }

    expect(await authOptions.callbacks.jwt({ token })).toBe(token)
  })
})

describe('session settings', () => {
  test('uses a JWT session that lasts as long as the ID token', () => {
    expect(SESSION_MAX_AGE).toBe(4 * 60 * 60)
    expect(authOptions.session).toEqual({
      strategy: 'jwt',
      maxAge: SESSION_MAX_AGE,
    })
    expect(authOptions.jwt.maxAge).toBe(SESSION_MAX_AGE)
  })

  test('sends sign in and errors to the login page', () => {
    expect(authOptions.pages).toEqual({ signIn: '/login', error: '/login' })
  })
})

describe('Cognito provider', () => {
  const original = { ...process.env }

  // The options authOptions passes to the Cognito provider for this environment
  const providerOptions = (env = {}) => {
    Object.assign(process.env, {
      COGNITO_CLIENT_ID: 'client-id',
      COGNITO_ISSUER: 'https://cognito-idp.eu-west-2.amazonaws.com/pool',
      ...env,
    })

    let options

    jest.isolateModules(() => {
      require('./authOptions')
      options = require('next-auth/providers/cognito').default.mock.calls.at(
        -1
      )[0]
    })

    return options
  }

  afterEach(() => {
    process.env = { ...original }
  })

  test('is set up from the Cognito environment settings', () => {
    expect(providerOptions()).toMatchObject({
      clientId: 'client-id',
      issuer: 'https://cognito-idp.eu-west-2.amazonaws.com/pool',
    })
  })

  test('uses PKCE, state and nonce checks', () => {
    expect(providerOptions().checks).toEqual(['pkce', 'state', 'nonce'])
  })

  test('requests the openid, email and profile scopes', () => {
    expect(providerOptions().authorization.params.scope).toBe(
      'openid email profile'
    )
  })

  test('is a public client when there is no client secret', () => {
    delete process.env.COGNITO_CLIENT_SECRET

    expect(providerOptions().client).toEqual({
      token_endpoint_auth_method: 'none',
    })
  })

  test('uses the client secret when there is one', () => {
    const options = providerOptions({ COGNITO_CLIENT_SECRET: 'secret' })

    expect(options.clientSecret).toBe('secret')
    expect(options.client).toBeUndefined()
  })
})
