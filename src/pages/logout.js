import { deleteSessions } from '../utils/googleAuth'
import { OPERATIVE_MANAGER_ROLE } from '../utils/user'

const LogoutPage = () => null

export const getServerSideProps = async ({ res }) => {
  deleteSessions(res)
  return { props: {} }
}

LogoutPage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default LogoutPage
