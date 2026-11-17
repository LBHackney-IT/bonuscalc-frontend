import CognitoProvider from 'next-auth/providers/cognito'
import { parseCognitoGroups } from '@/utils/cognito'

// The session lives in an encrypted cookie and there is no refresh token, so
// people sign in again once it has expired.
export const SESSION_MAX_AGE = 4 * 60 * 60

const { COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, COGNITO_ISSUER } = process.env

export const authOptions = {
  providers: [
    CognitoProvider({
      clientId: COGNITO_CLIENT_ID,
      clientSecret: COGNITO_CLIENT_SECRET || '',
      issuer: COGNITO_ISSUER,
      checks: ['pkce', 'state', 'nonce'],
      authorization: { params: { scope: 'openid email profile' } },
      // Public app clients have no secret
      ...(!COGNITO_CLIENT_SECRET && {
        client: { token_endpoint_auth_method: 'none' },
      }),
    }),
  ],
  session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE },
  jwt: { maxAge: SESSION_MAX_AGE },
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Only set on sign in. Afterwards the token is read back from the cookie.
      if (account) {
        if (!account.id_token || !profile?.sub) {
          throw new Error('Cognito did not return a complete ID token')
        }

        return {
          sub: profile.sub,
          name: profile.name ?? profile.email,
          email: profile.email,
          groups: parseCognitoGroups(profile['custom:groups']),
          // Forwarded to the service API from the server, never to the browser
          cognitoIdToken: account.id_token,
          cognitoTokenExpiresAt: profile.exp,
        }
      }

      return token
    },
  },
}
