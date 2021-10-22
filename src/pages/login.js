import PropTypes from 'prop-types'
import { redirectToHome, isAuthorised } from '@/utils/googleAuth'
import { getProtocol } from '@/utils/urls'
import UserLogin from '@/components/UserLogin'

const LoginPage = ({ gssoUrl, returnUrl }) => {
  return (
    <>
      <UserLogin
        submitText="Sign in with Google"
        gssoUrl={`${gssoUrl}${returnUrl}`}
      />
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const { GSSO_URL } = process.env
  const protocol = getProtocol()
  const { REDIRECT_URL } = process.env
  const host = REDIRECT_URL

  const user = isAuthorised(ctx)

  if (user && user.hasAnyPermissions) {
    console.log(ctx.res)
    redirectToHome(ctx.res)
  }

  return {
    props: {
      gssoUrl: GSSO_URL,
      returnUrl: `${protocol}://${host}`,
    },
  }
}

LoginPage.propTypes = {
  gssoUrl: PropTypes.string.isRequired,
  returnUrl: PropTypes.string.isRequired,
}

export default LoginPage
