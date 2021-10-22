import BackButton from '@/components/BackButton'
import OperativeSummary from '@/components/OperativeSummary'
import OperativeTabs from '@/components/OperativeTabs'
import { Week } from '@/models'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'

const OperativePage = ({ query }) => {
  return (
    <>
      <BackButton href="/" />
      <OperativeSummary payrollNumber={query.payrollNumber} />
      <OperativeTabs
        payrollNumber={query.payrollNumber}
        week={Week.current}
        tabIndex={0}
      />
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
