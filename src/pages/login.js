import { redirectToHome, isAuthorised } from '@/utils/session'
import UserLogin from '@/components/UserLogin'

const LoginPage = () => {
  return (
    <>
      <UserLogin submitText="Sign in with Google" />
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const user = await isAuthorised(ctx)

  if (user && user.hasAnyPermissions) {
    redirectToHome(ctx.res)
  }

  return {
    props: {},
  }
}

export default LoginPage
