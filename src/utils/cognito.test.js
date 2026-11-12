import { parseCognitoGroups, cognitoLogoutUrl } from './cognito'

describe('parseCognitoGroups', () => {
  test.each([
    [
      ['a', 'b'],
      ['a', 'b'],
    ],
    ['a,b', ['a', 'b']],
    ['a;b', ['a', 'b']],
    ['[a, b]', ['a', 'b']],
    [' a ; b , c ', ['a', 'b', 'c']],
    ['a', ['a']],
  ])('parses %j', (input, expected) => {
    expect(parseCognitoGroups(input)).toEqual(expected)
  })

  test.each([undefined, null, '', 42, {}, [1, null]])(
    'returns nothing for %j',
    (input) => {
      expect(parseCognitoGroups(input)).toEqual([])
    }
  )
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

  test('returns null when not configured', () => {
    delete process.env.COGNITO_DOMAIN

    expect(cognitoLogoutUrl()).toBeNull()
  })
})
