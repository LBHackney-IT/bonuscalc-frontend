import { isAuthorised, deleteSessions } from './googleAuth'
import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'

const {
  HACKNEY_JWT_SECRET,
  GSSO_TOKEN_NAME,
  OPERATIVE_MANAGERS_GOOGLE_GROUPNAME,
  WEEK_MANAGERS_GOOGLE_GROUPNAME,
} = process.env

describe('isAuthorised', () => {
  describe('when the request contains a JWT signed with the known secret', () => {
    const signedCookie = jsonwebtoken.sign(
      {
        name: 'name',
        email: 'name@example.com',
        groups: [
          OPERATIVE_MANAGERS_GOOGLE_GROUPNAME,
          WEEK_MANAGERS_GOOGLE_GROUPNAME,
        ],
      },
      HACKNEY_JWT_SECRET
    )

    const req = createRequest({
      headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
    })

    const res = createResponse()

    test('returns a user object with relevant fields and permissions', () => {
      const user = isAuthorised({ req, res })

      expect(user).toMatchObject({
        name: 'name',
        email: 'name@example.com',
        hasOperativeManagerPermissions: true,
        hasWeekManagerPermissions: true,
        hasAnyPermissions: true,
      })
    })
  })
})

describe('deleteSessions', () => {
  describe('expires the auth session along with other supplied sessions', () => {
    const res = createResponse()

    test('returns a user object with relevant fields and permissions', () => {
      deleteSessions(res, {
        additionalCookies: {
          'another-cookie': {
            domain: 'dlo-bonus-scheme.hackney.gov.uk',
            path: '/',
          },
        },
      })

      expect(res.getHeaders()['set-cookie']).toContain(
        `${GSSO_TOKEN_NAME}=null; Max-Age=-1; Domain=.hackney.gov.uk; Path=/`
      )

      expect(res.getHeaders()['set-cookie']).toContain(
        'another-cookie=null; Max-Age=-1; Domain=dlo-bonus-scheme.hackney.gov.uk; Path=/'
      )
    })
  })
})
