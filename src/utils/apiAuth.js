import cookie from 'cookie'
import axios from 'axios'
import logger from 'loglevel'
import { StatusCodes } from 'http-status-codes'
import { isAuthorised } from '@/utils/googleAuth'
import { paramsSerializer } from '@/utils/urls'

const {
  BONUSCALC_SERVICE_API_URL,
  BONUSCALC_SERVICE_API_KEY,
  GSSO_TOKEN_NAME,
  LOG_LEVEL,
} = process.env

const { FORBIDDEN, BAD_GATEWAY } = StatusCodes

const FORBIDDEN_ERROR = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.3',
  title: 'Forbidden',
  status: FORBIDDEN,
}

const BAD_GATEWAY_ERROR = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.6.4',
  title: 'Bad Gateway',
  status: BAD_GATEWAY,
}

logger.setLevel(logger.levels[LOG_LEVEL || 'INFO'])

export const authoriseAPIRequest = (callback) => {
  return async (req, res) => {
    const user = isAuthorised({ req }, false)

    if (!user) {
      return res.status(FORBIDDEN).json(FORBIDDEN_ERROR)
    }

    try {
      return await callback(req, res, user)
    } catch (error) {
      if (error.response) {
        logger.error('Service API response error:', error.response.statusText)
        return res.status(error.response.status).json(error.response.data)
      } else {
        logger.error('Service API request error:', error.message)
        return res.status(BAD_GATEWAY).json(BAD_GATEWAY_ERROR)
      }
    }
  }
}

export const forwardAPIRequest = async (req) => {
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
    logger.debug(
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
    logger.debug(
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
    data: req.body ? req.body : undefined,
  })

  return data
}
