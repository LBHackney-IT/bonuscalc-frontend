let reporterRules = require('./reporter-rules.json')

module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  clearMocks: true,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleDirectories: ['node_modules', '.'],
  moduleNameMapper: {
    '^csv/sync': '<rootDir>/node_modules/csv/dist/cjs/sync.cjs',
    '^.+\\.(css|scss)$': '<rootDir>/src/styles/__mocks__/styleMock.js',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/fixtures/(.*)$': '<rootDir>/tests/fixtures/$1',
    '^@/models': '<rootDir>/src/models/index.js',
    '^@/models/(.*)$': '<rootDir>/src/models/$1',
    '^@/reports/(.*)$': '<rootDir>/src/pages/api/reports/$1',
    '^@/root/(.*)$': '<rootDir>/$1',
    '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  reporters: [
    ['jest-clean-console-reporter', { rules: reporterRules }],
    '@jest/reporters/build/SummaryReporter',
  ],
}
