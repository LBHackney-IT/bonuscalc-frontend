import '@testing-library/jest-dom'
import dotenvFlow from 'dotenv-flow'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

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