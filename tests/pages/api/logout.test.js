import { createRequest, createResponse } from 'node-mocks-http'
import logout from '@/root/src/pages/api/logout'
import { cognitoLogoutUrl } from '@/utils/cognito'
import { clearStaffSessionCookies } from '@/utils/session'

jest.mock('@/utils/cognito')
jest.mock('@/utils/session')

const LOGOUT_URL = 'https://auth.example.com/logout?client_id=client-id'

describe('Signing out', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    cognitoLogoutUrl.mockReturnValue(LOGOUT_URL)
  })

  test('clears the session cookies and redirects to Cognito', () => {
    const req = createRequest({ method: 'GET' })
    const res = createResponse()

    logout(req, res)

    expect(clearStaffSessionCookies).toHaveBeenCalledWith(req, res)
    expect(res._getRedirectUrl()).toBe(LOGOUT_URL)
  })

  test('only allows GET', () => {
    const res = createResponse()

    logout(createRequest({ method: 'POST' }), res)

    expect(res.statusCode).toBe(405)
    expect(res.getHeader('Allow')).toBe('GET')
    expect(clearStaffSessionCookies).not.toHaveBeenCalled()
  })

  test('fails when Cognito is not configured', () => {
    cognitoLogoutUrl.mockReturnValue(null)
    const res = createResponse()

    logout(createRequest({ method: 'GET' }), res)

    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toEqual({
      title: 'Cognito logout is not configured',
    })
  })
})
