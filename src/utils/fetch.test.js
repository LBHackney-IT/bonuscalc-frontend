import axios from 'axios'
import { createRequest } from 'node-mocks-http'
import { getSessionToken } from '@/utils/session'

jest.mock('@/utils/session')

const mockGet = jest.fn()

jest.mock('axios', () => ({
  __esModule: true,
  default: { create: jest.fn(() => ({ get: (...args) => mockGet(...args) })) },
}))

const { fetchOperative, fetchSummary, fetchTimesheet } = require('./fetch')
const { fetchBandChange, fetchBandChanges } = require('./fetch')
const { fetchOutOfHoursSummaries, fetchOvertimeSummaries } = require('./fetch')

const req = createRequest({ method: 'POST' })

describe('service fetch helpers', () => {
  beforeEach(() => {
    mockGet.mockReset()
    getSessionToken.mockResolvedValue({ cognitoIdToken: 'token-123' })
    mockGet.mockResolvedValue({ status: 200, data: [] })
  })

  const calls = {
    fetchBandChanges: () => fetchBandChanges(req, '2024-01-01'),
    fetchBandChange: () => fetchBandChange(req, '123456'),
    fetchOperative: () => fetchOperative(req, '123456'),
    fetchSummary: () => fetchSummary(req, '123456', '2024-01-01'),
    fetchTimesheet: () => fetchTimesheet(req, '123456', '2024-01-01'),
    fetchOutOfHoursSummaries: () => fetchOutOfHoursSummaries(req, '2024-01-01'),
    fetchOvertimeSummaries: () => fetchOvertimeSummaries(req, '2024-01-01'),
  }

  test.each(Object.keys(calls))(
    '%s forwards the Authorization header from a POST request',
    async (name) => {
      await calls[name]().catch(() => {}) // model constructors may reject empty data

      expect(mockGet).toHaveBeenCalledTimes(1)
      const [, config] = mockGet.mock.calls[0]
      expect(config.headers['Authorization']).toBe('token-123')
      expect(config.headers['x-hackney-user']).toBe('token-123')
      expect(config.headers['x-api-key']).toBe(
        process.env.BONUSCALC_SERVICE_API_KEY
      )
    }
  )

  test('creates the axios client against the service URL', () => {
    expect(axios.create).toHaveBeenCalled()
  })
})
