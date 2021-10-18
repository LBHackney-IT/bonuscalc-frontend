import BackButton from '../../components/BackButton'
import OperativeView from '../../components/OperativeView'
import { OPERATIVE_MANAGER_ROLE } from '../../utils/user'

const OperativePage = ({ query }) => {
  return (
    <>
      <BackButton href="/" />
      <OperativeView payrollNumber={query.id} />
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
    },
  }
}

OperativePage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default OperativePage
