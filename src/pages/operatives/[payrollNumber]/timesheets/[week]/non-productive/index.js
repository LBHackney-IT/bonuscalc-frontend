import OperativePage from '@/components/OperativePage'
import NonProductiveSummary from '@/components/NonProductiveSummary'
import { OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE } from '@/utils/user'

const NonProductivePage = ({ query }) => (
  <OperativePage query={query} tab={2} component={NonProductiveSummary} />
)

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
    },
  }
}

NonProductivePage.permittedRoles = [OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE]

export default NonProductivePage
