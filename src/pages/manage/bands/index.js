import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import ManagePage from '@/components/ManagePage'
import BandChanges from '@/components/BandChanges'
import OperativeProjections from '@/components/OperativeProjections'
import { useBandChangePeriod } from '@/utils/apiClient'
import {
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
} from '@/utils/user'

const ManageBandsPage = ({ userDetails }) => {
  const { bonusPeriod, isLoading, isError } = useBandChangePeriod()

  if (isLoading) return <Spinner />
  if (isError || !bonusPeriod)
    return <NotFound>Couldn’t find a current bonus period.</NotFound>

  return (
    <ManagePage user={userDetails} section="bands">
      {bonusPeriod.hasOpenWeeks ? (
        <OperativeProjections period={bonusPeriod} />
      ) : (
        <BandChanges period={bonusPeriod} />
      )}
    </ManagePage>
  )
}

ManageBandsPage.permittedRoles = [
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
]

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
      currentPage: 'manage',
    },
  }
}

export default ManageBandsPage
