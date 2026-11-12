import axios from 'axios'
import logger from 'loglevel'
import * as Sentry from '@sentry/nextjs'
import { createRequest, createResponse } from 'node-mocks-http'
import { getSessionToken, isAuthorised } from '@/utils/session'
import { authoriseAPIRequest, forwardAPIRequest } from './apiAuth'

jest.mock('@/utils/session')
jest.mock('@/utils/urls', () => ({ paramsSerializer: jest.fn() }))

const user = { name: 'A Name', email: 'a.name@example.com' }

const upstreamError = (status, data) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    response: { status, statusText: 'Error', data },
  })

beforeEach(() => {
  jest.clearAllMocks()
})

describe('authoriseAPIRequest', () => {
  const run = async (handler) => {
    const req = createRequest()
    const res = createResponse()

    await authoriseAPIRequest(handler)(req, res)

    return { req, res }
  }

  test('checks the request without redirecting', async () => {
    isAuthorised.mockResolvedValue(user)

    const { req, res } = await run(jest.fn())

    expect(isAuthorised).toHaveBeenCalledWith({ req, res }, false)
  })

  describe('when the user is not authorised', () => {
    beforeEach(() => {
      isAuthorised.mockResolvedValue(false)
    })

    test('returns 403 without calling the handler', async () => {
      const handler = jest.fn()
      const { res } = await run(handler)

      expect(res.statusCode).toBe(403)
      expect(res._getJSONData()).toMatchObject({
        title: 'Forbidden',
        status: 403,
      })
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('when the user is authorised', () => {
    beforeEach(() => {
      isAuthorised.mockResolvedValue(user)
    })

    test('calls the handler with the request, response and user', async () => {
      const handler = jest.fn()
      const { req, res } = await run(handler)

      expect(handler).toHaveBeenCalledWith(req, res, user)
    })

    test('tells Sentry who the user is', async () => {
      await run(jest.fn())

      expect(Sentry.setUser).toHaveBeenCalledWith({
        name: 'A Name',
        email: 'a.name@example.com',
      })
    })

    test('passes on the status and body of an upstream error', async () => {
      const error = upstreamError(403, { message: 'No' })
      const { res } = await run(jest.fn().mockRejectedValue(error))

      expect(res.statusCode).toBe(403)
      expect(res._getJSONData()).toEqual({ message: 'No' })
      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })

    test('returns 502 when the upstream gives no response', async () => {
      const error = new Error('connect ECONNREFUSED')
      const { res } = await run(jest.fn().mockRejectedValue(error))

      expect(res.statusCode).toBe(502)
      expect(res._getJSONData()).toMatchObject({
        title: 'Bad Gateway',
        status: 502,
      })
      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })
  })

  test('returns 502 when checking the request fails', async () => {
    isAuthorised.mockRejectedValue(new Error('boom'))

    const { res } = await run(jest.fn())

    expect(res.statusCode).toBe(502)
  })
})

describe('forwardAPIRequest', () => {
  const api = Object.assign(jest.fn(), {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })

  const forward = (options = {}) =>
    forwardAPIRequest(
      createRequest({
        method: 'GET',
        query: { path: ['api', 'v1', 'periods'] },
        ...options,
      })
    )

  beforeEach(() => {
    axios.create.mockReturnValue(api)
    api.mockResolvedValue({ data: { ok: true } })
    getSessionToken.mockResolvedValue({ cognitoIdToken: 'id-token' })
  })

  test('returns the data from the API', async () => {
    expect(await forward()).toEqual({ ok: true })
  })

  test('sends the ID token from the session as the credentials', async () => {
    await forward()

    expect(api).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'id-token',
          'x-hackney-user': 'id-token',
        }),
      })
    )
  })

  test('sends the API key', async () => {
    await forward()

    expect(api).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': process.env.BONUSCALC_SERVICE_API_KEY,
        }),
      })
    )
  })

  test('sends empty credentials when there is no session', async () => {
    getSessionToken.mockResolvedValue(null)

    await forward()

    expect(api).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': '',
          'x-hackney-user': '',
        }),
      })
    )
  })

  test('forwards the method, path, query and body', async () => {
    await forward({
      method: 'POST',
      query: { path: ['api', 'v1', 'periods'], week: '2021-10-11' },
      body: { a: 1 },
    })

    expect(api).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: `${process.env.BONUSCALC_SERVICE_API_URL}/api/v1/periods`,
        params: { week: '2021-10-11' },
        data: { a: 1 },
      })
    )
  })

  test('keeps the upstream response on the error it throws', async () => {
    api.mockRejectedValue(upstreamError(403, { message: 'Forbidden' }))

    await expect(forward()).rejects.toMatchObject({
      response: { status: 403, data: { message: 'Forbidden' } },
    })
  })

  test('throws when the request fails without a response', async () => {
    api.mockRejectedValue(new Error('connect ECONNREFUSED'))

    await expect(forward()).rejects.toThrow('connect ECONNREFUSED')
  })

  test('redacts the credentials from the request log', async () => {
    const debug = jest.spyOn(logger, 'debug').mockImplementation(() => {})

    await forward()

    const [[logRequest]] = api.interceptors.request.use.mock.calls

    logRequest({
      headers: {
        'Authorization': 'id-token',
        'x-hackney-user': 'id-token',
        'x-api-key': 'secret-key',
      },
    })

    const logged = debug.mock.calls.flat().join('\n')

    debug.mockRestore()

    expect(logged).not.toMatch(/id-token|secret-key/)
    expect(logged).toContain('[REMOVED]')
  })
})
