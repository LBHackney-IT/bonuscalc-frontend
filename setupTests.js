import '@testing-library/jest-dom'
import dotenvFlow from 'dotenv-flow'
import { TextEncoder, TextDecoder } from 'util'
import { NotifyClient } from 'notifications-node-client'

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

jest.mock('notifications-node-client')

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