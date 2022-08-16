import nock from 'nock'
import jsonwebtoken from 'jsonwebtoken'
import { createMocks } from 'node-mocks-http'
import emailReport from '@/reports/operatives/[payrollNumber]/band-change'

const {
  HACKNEY_JWT_SECRET,
  GSSO_TOKEN_NAME,
  OPERATIVE_MANAGERS_GOOGLE_GROUPNAME,
  WEEK_MANAGERS_GOOGLE_GROUPNAME,
} = process.env

const signedCookie = jsonwebtoken.sign(
  {
    name: 'A Week Manager',
    email: 'a.weekmanager@hackney.gov.uk',
    groups: [
      OPERATIVE_MANAGERS_GOOGLE_GROUPNAME,
      WEEK_MANAGERS_GOOGLE_GROUPNAME,
    ],
  },
  HACKNEY_JWT_SECRET
)

const BASE_URL = 'http://localhost:5101'
const NOTIFY_URL = 'https://api.notifications.service.gov.uk'

const status = (res) => {
  return res._getStatusCode()
}

const json = (res) => {
  return JSON.parse(res._getData())
}

const fixture = (name) => {
  return require(`@/fixtures/${name}.json`)
}

const BAD_REQUEST_RESPONSE = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
  title: 'Bad Request',
  status: 400,
}

const FORBIDDEN_RESPONSE = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.3',
  title: 'Forbidden',
  status: 403,
}

const NOT_FOUND_RESPONSE = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
  title: 'Not Found',
  status: 404,
}

describe('Emailing band change reports', () => {
  beforeAll(() => {
    nock.disableNetConnect()
  })

  afterAll(() => {
    nock.enableNetConnect()
  })

  describe('A GET request', () => {
    describe('When unauthorized', () => {
      test('It returns a 403 response', async () => {
        const { req, res } = createMocks({
          method: 'GET',
          query: {
            payrollNumber: '123456',
          },
        })

        await emailReport(req, res)

        expect(status(res)).toBe(403)
        expect(json(res)).toEqual(expect.objectContaining(FORBIDDEN_RESPONSE))
      })
    })
  })

  describe('When authorized', () => {
    test('It returns a 404 response', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        headers: {
          Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
        },
        query: {
          payrollNumber: '123456',
        },
      })

      await emailReport(req, res)

      expect(status(res)).toBe(404)
      expect(json(res)).toEqual(expect.objectContaining(NOT_FOUND_RESPONSE))
    })
  })

  describe('A POST request', () => {
    describe('When unauthorized', () => {
      test('It returns a 403 response', async () => {
        const { req, res } = createMocks({
          method: 'POST',
          query: {
            payrollNumber: '123456',
          },
        })

        await emailReport(req, res)

        expect(status(res)).toBe(403)
        expect(json(res)).toEqual(expect.objectContaining(FORBIDDEN_RESPONSE))
      })
    })

    describe('When authorized', () => {
      describe('And the payroll number is invalid', () => {
        test('It returns a 400 response', async () => {
          const { req, res } = createMocks({
            method: 'POST',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              payrollNumber: '999',
            },
          })

          await emailReport(req, res)

          expect(status(res)).toBe(400)
          expect(json(res)).toEqual(
            expect.objectContaining(BAD_REQUEST_RESPONSE)
          )
        })
      })

      describe('And the request is valid', () => {
        test('It sends an email', async () => {
          const { req, res } = createMocks({
            method: 'POST',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              payrollNumber: '123456',
            },
          })

          nock(BASE_URL)
            .get('/api/v1/operatives/123456')
            .reply(200, fixture('operatives/electrician'))
            .get('/api/v1/band-changes/123456')
            .reply(200, fixture('band-changes/2021-08-02'))

          nock(NOTIFY_URL)
            .post('/v2/notifications/email')
            .reply(200, { message: 'Email sent' })

          await emailReport(req, res)

          expect(status(res)).toBe(200)
          expect(json(res)).toEqual(
            expect.objectContaining({
              message: 'Email sent',
            })
          )
        })
      })

      describe('And the operative is archived', () => {
        test('It does not send an email', async () => {
          const { req, res } = createMocks({
            method: 'POST',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              payrollNumber: '123456',
            },
          })

          nock(BASE_URL)
            .get('/api/v1/operatives/123456')
            .reply(200, fixture('operatives/archived'))

          await emailReport(req, res)

          expect(status(res)).toBe(204)
        })
      })

      describe('And the operative has no email address', () => {
        test('It does not send an email', async () => {
          const { req, res } = createMocks({
            method: 'POST',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              payrollNumber: '123456',
            },
          })

          nock(BASE_URL)
            .get('/api/v1/operatives/123456')
            .reply(200, fixture('operatives/no-email'))

          await emailReport(req, res)

          expect(status(res)).toBe(204)
        })
      })
    })
  })
})
