import BackButton from '@/components/BackButton'
import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import CloseBonusPeriod from '@/components/CloseBonusPeriod'
import { useBandChangePeriod, useBandChanges } from '@/utils/apiClient'
import { WEEK_MANAGER_ROLE } from '@/utils/user'

const CloseBonusPeriodPage = ({ query }) => {
  const {
    bonusPeriod,
    isLoading: isPeriodLoading,
    isError: isPeriodError,
  } = useBandChangePeriod()

  const {
    bandChanges,
    isLoading: isBandChangesLoading,
    isError: isBandChangesError,
  } = useBandChanges()

  if (isPeriodLoading) return <Spinner />
  if (isPeriodError || !bonusPeriod)
    return <NotFound>Couldn’t find an open bonus period.</NotFound>

  if (isBandChangesLoading) return <Spinner />
  if (isBandChangesError || !bandChanges)
    return <NotFound>Couldn’t find any band changes.</NotFound>

  return (
    <>
      <BackButton href={query.backUrl || '/manage/weeks'} />
      <CloseBonusPeriod period={bonusPeriod} bandChanges={bandChanges} />
    </>
  )
}

CloseBonusPeriodPage.permittedRoles = [WEEK_MANAGER_ROLE]

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
    },
  }
}

export default CloseBonusPeriodPage
