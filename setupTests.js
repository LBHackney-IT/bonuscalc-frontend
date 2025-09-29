import '@testing-library/jest-dom'
import dotenvFlow from 'dotenv-flow'
import nock from 'nock'


dotenvFlow.config({ silent: true })

// Mock Sentry module so tests can load API routes
jest.mock('@sentry/nextjs', () => {
  return {
    __esModule: true,
    init: jest.fn(() => 'Sentry.init'),
    captureException: jest.fn(() => 'Sentry.captureException'),
    configureScope: jest.fn(() => 'Sentry.configureScope'),
    setUser: jest.fn(() => 'Sentry.setUser'),
    setTag: jest.fn(() => 'Sentry.setTag'),
  }
})


// Either, we need to disbale the options/cors request, which im strugging to to. Or we need to instercept the options request