import OperativePage from '@/components/OperativePage'
import OvertimeSummary from '@/components/OvertimeSummary'
import { OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE } from '@/utils/user'

const OvertimePage = ({ query }) => (
  <OperativePage query={query} tab={4} component={OvertimeSummary} />
)

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
    },
  }
}

OvertimePage.permittedRoles = [OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE]

export default OvertimePage
