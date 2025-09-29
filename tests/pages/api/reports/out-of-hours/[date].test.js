import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'
import { parse } from 'csv/sync'
import outOfHoursReport from '@/reports/out-of-hours/[date]'
import axios from 'axios'
const mockClient = axios.__mockClient

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

describe('Downloading out-of-hours reports', () => {
  describe('A GET request', () => {
    describe('When unauthorized', () => {
      test('It returns a 403 response', async () => {
        const req = createRequest({
          method: 'GET',
          query: {
            date: '2021-10-18',
          },
        })
        const res = createResponse()

        await outOfHoursReport(req, res)

        expect(status(res)).toBe(403)
        expect(json(res)).toEqual(expect.objectContaining(FORBIDDEN_RESPONSE))
      })
    })

    describe('When authorized', () => {
      describe('And the date is invalid', () => {
        test('It returns a 400 response', async () => {
          const req = createRequest({
            method: 'GET',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              date: '20211018',
            },
          })
          const res = createResponse()

          await outOfHoursReport(req, res)

          expect(status(res)).toBe(400)
          expect(json(res)).toEqual(
            expect.objectContaining(BAD_REQUEST_RESPONSE)
          )
        })
      })

      describe('And the request is valid', () => {
        test('It downloads a CSV file', async () => {
          const req = createRequest({
            method: 'GET',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              date: '2021-10-18',
            },
          })
          const res = createResponse()

          mockClient.get.mockImplementation((url) => {
            if (url === `/weeks/2021-10-18/out-of-hours`) {
              return Promise.resolve({
                status: 200,
                data: fixture('out-of-hours/2021-10-18')
              })
            }
          })

          await outOfHoursReport(req, res)
          const csv = parse(data(res))

          expect(status(res)).toBe(200)
          expect(header(res, 'content-type')).toBe('text/csv')
          expect(header(res, 'content-disposition')).toBe(
            'attachment; filename="out-of-hours-2021-10-18.csv"'
          )

          expect(csv.length).toBe(2)

          expect(csv[0]).toEqual([
            'Payroll Number',
            'Operative',
            'Trade',
            'Cost Code',
            'Amount',
          ])

          expect(csv[1]).toEqual([
            '123456',
            'Alex Cable',
            'Electrician (EL)',
            'H3015',
            '175.00',
          ])
        })
      })

      describe('And the request is valid but there is no data', () => {
        test('It downloads a CSV file', async () => {
          const req = createRequest({
            method: 'GET',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              date: '2021-10-18',
            },
          })
          const res = createResponse()

          mockClient.get.mockImplementation((url) => {
            if (url === `/weeks/2021-10-18/out-of-hours`) {
              return Promise.resolve({
                status: 200,
                data: fixture('out-of-hours/empty')
              })
            }
          })

          await outOfHoursReport(req, res)
          const csv = parse(data(res))

          expect(status(res)).toBe(200)
          expect(header(res, 'content-type')).toBe('text/csv')
          expect(header(res, 'content-disposition')).toBe(
            'attachment; filename="out-of-hours-2021-10-18.csv"'
          )

          expect(csv.length).toBe(1)

          expect(csv[0]).toEqual(['No out-of-hours records for this week'])
        })
      })
    })
  })
})
