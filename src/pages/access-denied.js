import { redirectToHome, isAuthorised } from '@/utils/session'
import AccessDenied from '@/components/AccessDenied'

const AccessDeniedPage = () => {
  return (
    <>
      <AccessDenied />
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

export default AccessDeniedPage
