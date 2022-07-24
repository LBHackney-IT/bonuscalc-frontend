import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import ManagePage from '@/components/ManagePage'
import BonusPeriods from '@/components/BonusPeriods'
import { useBonusPeriods } from '@/utils/apiClient'
import { WEEK_MANAGER_ROLE } from '@/utils/user'

const ManageBonusPeriodsPage = ({ userDetails }) => {
  const { bonusPeriods, isLoading, isError } = useBonusPeriods()

  if (isLoading) return <Spinner />
  if (isError || !bonusPeriods)
    return <NotFound>Couldn’t find any bonus periods.</NotFound>

  return (
    <ManagePage user={userDetails} section="periods">
      <BonusPeriods periods={bonusPeriods} />
    </ManagePage>
  )
}

ManageBonusPeriodsPage.permittedRoles = [WEEK_MANAGER_ROLE]

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
      currentPage: 'manage',
    },
  }
}

export default ManageBonusPeriodsPage
