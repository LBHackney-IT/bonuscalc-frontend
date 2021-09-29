import cookie from 'cookie'
import axios from 'axios'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { isAuthorised } from '../../utils/googleAuth'
import { paramsSerializer } from '../../utils/urls'

const {
  BONUSCALC_SERVICE_API_URL,
  BONUSCALC_SERVICE_API_KEY,
  GSSO_TOKEN_NAME,
} = process.env

const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = StatusCodes

const jsonError = (res, code, detail) => {
  const title = getReasonPhrase(code)
  const status = code.toString()
  const json = { errors: [{ status, title, detail }] }

  return res.status(code).json(json)
}

const authoriseAPIRequest = (callback) => {
  return async (req, res) => {
    const user = isAuthorised({ req }, false)

    if (!user) {
      return jsonError(res, UNAUTHORIZED, 'Authentication cookie missing')
    }

    try {
      return await callback(req, res, user)
    } catch (error) {
      if (error.response) {
        console.error('Service API response error:', error.response.statusText)
        return jsonError(res, error.response.status)
      } else if (error.request) {
        console.error('Service API connection error:', error.message)
        return jsonError(
          res,
          INTERNAL_SERVER_ERROR,
          'Service API connection error'
        )
      } else {
        console.error('Service API request setup error:', error.message)
        return jsonError(
          res,
          INTERNAL_SERVER_ERROR,
          'Service API request setup error'
        )
      }
    }
  }
}

const forwardAPIRequest = async (req) => {
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const token = cookies[GSSO_TOKEN_NAME]

  const headers = {
    'x-api-key': BONUSCALC_SERVICE_API_KEY,
    'x-hackney-user': token || '',
    'content-type': 'application/json',
  }

  let { path, ...queryParams } = req.query

  const api = axios.create()

  // Log request
  api.interceptors.request.use((request) => {
    console.info(
      'Starting service API request:',
      JSON.stringify({
        ...request,
        headers: {
          ...request.headers,
          'x-api-key': '[REMOVED]',
          'x-hackney-user': '[REMOVED]',
        },
      })
    )

    return request
  })

  // Log response
  api.interceptors.response.use((response) => {
    console.info(
      `Service API response: ${response.status} ${
        response.statusText
      } ${JSON.stringify(response.data)}`
    )

    return response
  })

  const { data } = await api({
    method: req.method,
    headers,
    url: `${BONUSCALC_SERVICE_API_URL}/${path?.join('/')}`,
    params: queryParams,
    paramsSerializer: paramsSerializer,
    data: req.body || '{}',
  })

  return data
}

export default authoriseAPIRequest(async (req, res) => {
  const data = await forwardAPIRequest(req)

  res.status(OK).json(data)
})
