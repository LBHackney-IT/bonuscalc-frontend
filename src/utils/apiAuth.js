import axios from 'axios'
import logger from 'loglevel'
import { StatusCodes } from 'http-status-codes'
import {
  getSessionToken,
  isAuthorised,
  clearSessionCookies,
} from '@/utils/session'
import { paramsSerializer } from '@/utils/urls'

// Sentry doesn't load the config for API routes automatically
import * as Sentry from '@sentry/nextjs'

const { BONUSCALC_SERVICE_API_URL, BONUSCALC_SERVICE_API_KEY, LOG_LEVEL } =
  process.env

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
    try {
      const user = await isAuthorised({ req, res }, false)

      if (!user) {
        return res.status(FORBIDDEN).json(FORBIDDEN_ERROR)
      } else {
        Sentry.setUser({ name: user.name, email: user.email })
      }

      Sentry.getCurrentScope().addEventProcessor(clearSessionCookies)

      return await callback(req, res, user)
    } catch (error) {
      Sentry.captureException(error)

      if (error.response) {
        const { status, statusText, data, headers, config } = error.response

        // x-amzn-errortype / x-amzn-requestid help tell an authorizer denial
        // (AccessDeniedException) from a bad API key (ForbiddenException)
        logger.error(
          'Service API response error:',
          JSON.stringify({
            request: `${config?.method?.toUpperCase()} ${config?.url}`,
            status,
            statusText,
            data,
            errorType: headers?.['x-amzn-errortype'],
            requestId: headers?.['x-amzn-requestid'],
          })
        )
        return res.status(status).json(data)
      } else {
        logger.error('Service API request error:', error.message)
        return res.status(BAD_GATEWAY).json(BAD_GATEWAY_ERROR)
      }
    }
  }
}

export const buildServiceHeaders = async (req) => {
  const session = await getSessionToken(req)
  const token = session?.cognitoIdToken

  return {
    'x-api-key': BONUSCALC_SERVICE_API_KEY,
    'x-hackney-user': token || '',
    Authorization: token || '',
    'content-type': 'application/json',
  }
}

export const forwardAPIRequest = async (req) => {
  const headers = await buildServiceHeaders(req)
  const token = headers.Authorization

  logger.debug(
    'Service API auth:',
    JSON.stringify({
      hasToken: !!token,
      tokenLength: token?.length,
      tokenParts: token?.split('.').length,
      hasApiKey: !!BONUSCALC_SERVICE_API_KEY,
      apiUrl: BONUSCALC_SERVICE_API_URL,
    })
  )

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
          Authorization: '[REMOVED]',
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

  try {
    const { data } = await api({
      method: req.method,
      headers,
      url: `${BONUSCALC_SERVICE_API_URL}/${path?.join('/')}`,
      params: queryParams,
      paramsSerializer: paramsSerializer,
      data: req.body ? req.body : undefined,
    })

    return data
  } catch (error) {
    // Keep the original response so the caller can log and forward it
    const errorToThrow = new Error(error)
    errorToThrow.response = error.response
    throw errorToThrow
  }
}
