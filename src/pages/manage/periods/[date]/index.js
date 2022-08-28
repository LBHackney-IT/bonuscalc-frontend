import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import ErrorMessage from '@/components/ErrorMessage'
import ManagePage from '@/components/ManagePage'
import PreviousBandChanges from '@/components/PreviousBandChanges'
import { useBonusPeriod } from '@/utils/apiClient'
import { WEEK_MANAGER_ROLE } from '@/utils/user'

const ManageBonusPeriodPage = ({ query, userDetails }) => {
  const { date } = query
  const { bonusPeriod, isLoading, isError } = useBonusPeriod(date)

  if (isLoading) return <Spinner />
  if (isError || !bonusPeriod)
    return <NotFound>Couldn’t find the bonus period.</NotFound>

  if (bonusPeriod.isOpen)
    return (
      <ManagePage user={userDetails} section="periods">
        <ErrorMessage description="The bonus period is still open so there are no band changes to view yet" />
      </ManagePage>
    )

  return (
    <ManagePage user={userDetails} section="periods">
      <PreviousBandChanges period={bonusPeriod} />
    </ManagePage>
  )
}

ManageBonusPeriodPage.permittedRoles = [WEEK_MANAGER_ROLE]

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
      currentPage: 'manage',
    },
  }
}

export default ManageBonusPeriodPage
