import ServerError from '@/components/ServerError'

const ErrorPage = () => {
  return (
    <ServerError>
      Sorry, a server error occurred processing your request.
    </ServerError>
  )
}

export default ErrorPage
