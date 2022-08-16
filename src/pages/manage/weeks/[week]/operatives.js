import BackButton from '@/components/BackButton'
import NotFound from '@/components/NotFound'
import Spinner from '@/components/Spinner'
import AllOperativesList from '@/components/AllOperativesList'
import { useSchemes, useWeek, useCurrentBonusPeriods } from '@/utils/apiClient'
import {
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
} from '@/utils/user'

const AllOperativesPage = ({ query }) => {
  const {
    week,
    isLoading: isWeekLoading,
    isError: isWeekError,
  } = useWeek(query.week)

  const {
    schemes,
    isLoading: isSchemesLoading,
    isError: isSchemesError,
  } = useSchemes()

  const {
    bonusPeriods,
    isLoading: isBonusPeriodsLoading,
    isError: isBonusPeriodsError,
  } = useCurrentBonusPeriods()

  if (isWeekLoading) return <Spinner />
  if (isWeekError || !week)
    return (
      <NotFound>
        Couldn’t find operatives for the week beginning {query.week}.
      </NotFound>
    )

  if (isSchemesLoading) return <Spinner />
  if (isSchemesError || !schemes)
    return (
      <NotFound>
        Couldn’t find pay bands for the operative bonus schemes.
      </NotFound>
    )

  if (isBonusPeriodsLoading) return <Spinner />
  if (isBonusPeriodsError || !bonusPeriods)
    return <NotFound>Couldn’t find any current bonus periods.</NotFound>

  const period = bonusPeriods.find((p) => p.id == week.bonusPeriod.id)

  return (
    <>
      <BackButton href="/manage/weeks" />
      <AllOperativesList period={period} week={week} schemes={schemes} />
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

AllOperativesPage.permittedRoles = [
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
]

export default AllOperativesPage
