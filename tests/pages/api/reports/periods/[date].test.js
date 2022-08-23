import nock from 'nock'
import jsonwebtoken from 'jsonwebtoken'
import { createMocks } from 'node-mocks-http'
import { parse } from 'csv/sync'
import bonusPeriodReport from '@/reports/periods/[date]'

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

const status = (res) => {
  return res._getStatusCode()
}

const header = (res, name) => {
  return res._getHeaders()[name]
}

const data = (res) => {
  return res._getData()
}

const json = (res) => {
  return JSON.parse(data(res))
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

describe('Downloading bonus peroid reports', () => {
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
            date: '2021-10-18',
          },
        })

        await bonusPeriodReport(req, res)

        expect(status(res)).toBe(403)
        expect(json(res)).toEqual(expect.objectContaining(FORBIDDEN_RESPONSE))
      })
    })

    describe('When authorized', () => {
      describe('And the date is invalid', () => {
        test('It returns a 400 response', async () => {
          const { req, res } = createMocks({
            method: 'GET',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              date: '20211018',
            },
          })

          await bonusPeriodReport(req, res)

          expect(status(res)).toBe(400)
          expect(json(res)).toEqual(
            expect.objectContaining(BAD_REQUEST_RESPONSE)
          )
        })
      })

      describe('And the request is valid', () => {
        test('It downloads a CSV file', async () => {
          const { req, res } = createMocks({
            method: 'GET',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              date: '2021-08-02',
            },
          })

          nock(BASE_URL)
            .get('/api/v1/band-changes?date=2021-08-02')
            .reply(200, fixture('band-changes/changes'))

          await bonusPeriodReport(req, res)
          const csv = parse(data(res))

          expect(status(res)).toBe(200)
          expect(header(res, 'content-type')).toBe('text/csv')
          expect(header(res, 'content-disposition')).toBe(
            'attachment; filename="payroll-file-2021-08-02.csv"'
          )

          expect(csv.length).toBe(2)

          expect(csv[0]).toEqual([
            'Payroll No.',
            'Final Band',
            'Trade Code',
            'Bonus Rate',
            'Band 1',
            'Band 2',
            'Band 3',
            'Band 4',
            'Band 5',
            'Band 6',
            'Band 7',
            'Band 8',
            'Band 9',
          ])

          expect(csv[1]).toEqual([
            '123456',
            '6',
            'EL',
            '1',
            '',
            '',
            '',
            '',
            '',
            '602.29',
            '',
            '',
            '',
          ])
        })
      })

      describe('And the request is valid but there is no data', () => {
        test('It downloads a CSV file', async () => {
          const { req, res } = createMocks({
            method: 'GET',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              date: '2021-08-02',
            },
          })

          nock(BASE_URL)
            .get('/api/v1/band-changes?date=2021-08-02')
            .reply(200, fixture('band-changes/empty'))

          await bonusPeriodReport(req, res)
          const csv = parse(data(res))

          expect(status(res)).toBe(200)
          expect(header(res, 'content-type')).toBe('text/csv')
          expect(header(res, 'content-disposition')).toBe(
            'attachment; filename="payroll-file-2021-08-02.csv"'
          )

          expect(csv.length).toBe(1)

          expect(csv[0]).toEqual(['No band changes for this period'])
        })
      })
    })
  })
})
