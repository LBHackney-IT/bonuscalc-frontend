import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'
import emailReport from '@/reports/operatives/[payrollNumber]/band-change'

jest.mock('axios', () => {
  const mockClient = {
    get: jest.fn(),
    post: jest.fn(),
  }
  
  return {
    default: {
      create: jest.fn(() => mockClient),
    },
    create: jest.fn(() => mockClient),
    __mockClient: mockClient,
  }
})

import axios from 'axios'
const mockClient = axios.__mockClient

import { NotifyClient } from 'notifications-node-client'
jest.mock('notifications-node-client')

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
    const mockSendEmail = jest.fn().mockResolvedValue({
      data: { message: 'Email sent' }
    })

    const mockPrepareUpload = jest.fn().mockReturnValue('mocked-file-upload')

    NotifyClient.mockImplementation(() => ({
      sendEmail: mockSendEmail,
      prepareUpload: mockPrepareUpload
    }))
  })

  describe('A GET request', () => {
    describe('When unauthorized', () => {
      test('It returns a 403 response', async () => {
        const req = createRequest({
          method: 'GET',
          query: {
            payrollNumber: '123456',
          },
        })
        const res = createResponse()

        await emailReport(req, res)

        expect(status(res)).toBe(403)
        expect(json(res)).toEqual(expect.objectContaining(FORBIDDEN_RESPONSE))
      })
    })
  })

  describe('When authorized', () => {
    test('It returns a 404 response', async () => {
      const req = createRequest({
        method: 'GET',
        headers: {
          Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
        },
        query: {
          payrollNumber: '123456',
        },
      })
      const res = createResponse()

      await emailReport(req, res)

      expect(status(res)).toBe(404)
      expect(json(res)).toEqual(expect.objectContaining(NOT_FOUND_RESPONSE))
    })
  })

  describe('A POST request', () => {
    describe('When unauthorized', () => {
      test('It returns a 403 response', async () => {
        const req = createRequest({
          method: 'POST',
          query: {
            payrollNumber: '123456',
          },
        })
        const res = createResponse()

        await emailReport(req, res)

        expect(status(res)).toBe(403)
        expect(json(res)).toEqual(expect.objectContaining(FORBIDDEN_RESPONSE))
      })
    })

    describe('When authorized', () => {
      describe('And the payroll number is invalid', () => {
        test('It returns a 400 response', async () => {
          const req = createRequest({
            method: 'POST',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              payrollNumber: '999',
            },
          })
          const res = createResponse()

          await emailReport(req, res)

          expect(status(res)).toBe(400)
          expect(json(res)).toEqual(
            expect.objectContaining(BAD_REQUEST_RESPONSE)
          )
        })
      })

      describe('And the request is valid', () => {
        test('It sends an email', async () => {
          const req = createRequest({
            method: 'POST',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              payrollNumber: '123456',
            },
          })

          const res = createResponse()

          mockClient.get.mockImplementation((url) => {

            if (url === `/operatives/123456`) {
              return Promise.resolve({
                status: 200,
                data: fixture('operatives/electrician')
              })
            }

            if (url === `/band-changes/123456`) {
              return Promise.resolve({
                status: 200,
                data: fixture('band-changes/2021-08-02')
              })
            }
          })

          // mock email


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
          const req = createRequest({
            method: 'POST',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              payrollNumber: '123456',
            },
          })
          const res = createResponse()

          mockClient.get.mockImplementation((url) => {
            if (url === `/operatives/123456`) {
              return Promise.resolve({
                status: 200,
                data: fixture('operatives/archived')
              })
            }
          })

          await emailReport(req, res)

          expect(status(res)).toBe(204)
        })
      })

      describe('And the operative has no email address', () => {
        test('It does not send an email', async () => {
          const req = createRequest({
            method: 'POST',
            headers: {
              Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};`,
            },
            query: {
              payrollNumber: '123456',
            },
          })
          const res = createResponse()


          mockClient.get.mockImplementation((url) => {
            if (url === `/operatives/123456`) {
              return Promise.resolve({
                status: 200,
                data: fixture('operatives/no-email')
              })
            }
          })

          await emailReport(req, res)

          expect(status(res)).toBe(204)
        })
      })
    })
  })
})
