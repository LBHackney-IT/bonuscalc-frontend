import { parseCognitoGroups, cognitoLogoutUrl } from './cognito'

describe('parseCognitoGroups', () => {
  test.each([
    [
      ['a', 'b'],
      ['a', 'b'],
    ],
    ['a;b', ['a', 'b']],
    ['[a, b]', ['a', 'b']],
    ['a', ['a']],
  ])('parses %j', (input, expected) => {
    expect(parseCognitoGroups(input)).toEqual(expected)
  })

  test.each([undefined, ''])('returns nothing for %j', (input) => {
    expect(parseCognitoGroups(input)).toEqual([])
  })
})

describe('cognitoLogoutUrl', () => {
  const original = { ...process.env }

  afterEach(() => {
    process.env = { ...original }
  })

  test('returns the hosted UI logout url that returns to /login', () => {
    process.env.COGNITO_DOMAIN = 'https://auth.example.com/'
    process.env.COGNITO_CLIENT_ID = 'client-id'
    process.env.NEXTAUTH_URL = 'https://app.example.com'

    expect(cognitoLogoutUrl()).toBe(
      'https://auth.example.com/logout?client_id=client-id&logout_uri=https%3A%2F%2Fapp.example.com%2Flogin'
    )
  })

  const configure = (overrides = {}) => {
    process.env.COGNITO_DOMAIN = 'auth.example.com'
    process.env.COGNITO_CLIENT_ID = 'client-id'
    process.env.NEXTAUTH_URL = 'https://app.example.com'
    Object.assign(process.env, overrides)
  }

  test.each(['COGNITO_DOMAIN', 'COGNITO_CLIENT_ID', 'NEXTAUTH_URL'])(
    'returns null when %s is missing',
    (name) => {
      configure()
      delete process.env[name]

      expect(cognitoLogoutUrl()).toBeNull()
    }
  )

  test.each([
    'auth.example.com',
    'auth.example.com/',
    'https://auth.example.com',
    'http://auth.example.com/',
  ])('accepts the domain %s', (domain) => {
    configure({ COGNITO_DOMAIN: domain })

    expect(cognitoLogoutUrl()).toMatch(
      /^https:\/\/auth\.example\.com\/logout\?/
    )
  })

  test('copes with a trailing slash on the app url', () => {
    configure({ NEXTAUTH_URL: 'http://localhost:5001/' })

    expect(new URL(cognitoLogoutUrl()).searchParams.get('logout_uri')).toBe(
      'http://localhost:5001/login'
    )
  })

  test('encodes the client id', () => {
    configure({ COGNITO_CLIENT_ID: 'a b&c' })

    expect(new URL(cognitoLogoutUrl()).searchParams.get('client_id')).toBe(
      'a b&c'
    )
  })
})
