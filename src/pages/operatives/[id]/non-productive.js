import BackButton from '@/components/BackButton'
import OperativeSummary from '@/components/OperativeSummary'
import OperativeTabs from '@/components/OperativeTabs'
import NonProductiveSummary from '@/components/NonProductiveSummary'
import { Week } from '@/models'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'

const OperativePage = ({ query }) => {
  return (
    <>
      <BackButton href="/" />
      <OperativeSummary payrollNumber={query.id} />
      <OperativeTabs payrollNumber={query.id} tabIndex={2}>
        <NonProductiveSummary
          payrollNumber={query.id}
          weekBeginning={query.week}
        />
      </OperativeTabs>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  if (!query.week) {
    query.week = Week.current()
  }

  return {
    props: {
      query: query,
    },
  }
}

OperativePage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default OperativePage
