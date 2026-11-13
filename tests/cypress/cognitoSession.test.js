import { authOptions } from '@/utils/authOptions'
import { buildSessionToken } from '@/root/cypress/plugins/cognitoSession'

// The Cypress plugin can't load authOptions, so it builds the session token
// itself. This keeps the two in step.
describe('the Cypress real Cognito session', () => {
  const idToken = 'header.payload.signature'

  test.each([
    {
      sub: 'abc',
      name: 'A Name',
      email: 'a.name@example.com',
      'custom:groups': '[group-a, group-b]',
      exp: 1900000000,
    },
    { sub: 'abc', email: 'a.name@example.com', exp: 1900000000 },
    {
      sub: 'abc',
      name: 'A Name',
      email: 'a.name@example.com',
      'custom:groups': ['group-a'],
      exp: 1900000000,
    },
  ])('matches the jwt callback for %j', async (profile) => {
    const fromApp = await authOptions.callbacks.jwt({
      token: {},
      account: { id_token: idToken },
      profile,
    })

    expect(buildSessionToken(idToken, profile)).toEqual(fromApp)
  })
})
