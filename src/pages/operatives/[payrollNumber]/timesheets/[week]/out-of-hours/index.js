import OperativePage from '@/components/OperativePage'
import OutOfHoursSummary from '@/components/OutOfHoursSummary'
import {
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
} from '@/utils/user'

const OutOfHoursPage = ({ query }) => (
  <OperativePage query={query} tab={3} component={OutOfHoursSummary} />
)

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
    },
  }
}

OutOfHoursPage.permittedRoles = [
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
]

export default OutOfHoursPage
