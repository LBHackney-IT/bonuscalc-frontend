const SEPARATOR = /[;,]/

// Cognito passes the Google groups through as `custom:groups`. Depending on
// the attribute mapping this arrives as an array or as a single string such as
// "[group-a, group-b]" or "group-a;group-b".
export const parseCognitoGroups = (value) => {
  const items = Array.isArray(value) ? value : [value]

  return items
    .filter((item) => typeof item === 'string')
    .flatMap((item) => item.replace(/^\[|\]$/g, '').split(SEPARATOR))
    .map((name) => name.trim())
    .filter(Boolean)
}

export const cognitoLogoutUrl = () => {
  const { COGNITO_DOMAIN, COGNITO_CLIENT_ID, NEXTAUTH_URL } = process.env

  if (!COGNITO_DOMAIN || !COGNITO_CLIENT_ID || !NEXTAUTH_URL) {
    return null
  }

  const domain = COGNITO_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const params = new URLSearchParams({
    client_id: COGNITO_CLIENT_ID,
    logout_uri: `${NEXTAUTH_URL.replace(/\/$/, '')}/login`,
  })

  return `https://${domain}/logout?${params}`
}
