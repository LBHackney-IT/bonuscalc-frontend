import BackButton from '@/components/BackButton'
import OperativeSummary from '@/components/OperativeSummary'
import OperativeTabs from '@/components/OperativeTabs'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'

const OperativePage = ({ query }) => {
  return (
    <>
      <BackButton href="/" />
      <OperativeSummary payrollNumber={query.id} />
      <OperativeTabs payrollNumber={query.id} tabIndex={1} />
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
