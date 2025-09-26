import '@testing-library/jest-dom/extend-expect'
import dotenvFlow from 'dotenv-flow'

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





// Force the axios default adapter to Node's http module.
// Otherwise all the requests will use the XHR adapter and
// will run pre-flight CORS checks.
// jest.mock('axios', () => {
//   const axios = jest.requireActual('axios')
//   axios.defaults.adapter = jest.requireActual('axios/lib/adapters/http')

//   return axios
// })


// jest.mock('axios', () => {
//   const axios = jest.requireActual('axios/dist/node/axios.cjs')
//   return axios
// })

// jest.mock('axios', () => {
//   try {
//     // Try the CommonJS version first
//     const axios = jest.requireActual('axios/dist/node/axios.cjs')
//     return axios
//   } catch (error) {
//     // Fallback to the regular require if CJS version doesn't exist
//     const axios = jest.requireActual('axios')
//     // Set a default adapter that works in Node.js
//     if (axios.defaults) {
//       const http = jest.requireActual('http')
//       const https = jest.requireActual('https')
//       axios.defaults.adapter = jest.requireActual('axios/lib/adapters/http.js')
//     }
//     return axios
//   }
// })