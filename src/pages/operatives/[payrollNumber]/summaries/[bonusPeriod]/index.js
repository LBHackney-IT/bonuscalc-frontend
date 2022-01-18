import PageContext from '@/components/PageContext'
import BackButton from '@/components/BackButton'
import OperativeSummary from '@/components/OperativeSummary'
import OperativeTabs from '@/components/OperativeTabs'
import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import BonusPeriodSummary from '@/components/BonusPeriodSummary'
import { Week } from '@/models'
import { useOperative, useSummary } from '@/utils/apiClient'
import { OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE } from '@/utils/user'
import { setTag } from '@sentry/nextjs'

const SummaryPage = ({ query }) => {
  const { payrollNumber, bonusPeriod, backUrl } = query
  const week = Week.default(bonusPeriod)

  const {
    operative,
    isLoading: isOperativeLoading,
    isError: isOperativeError,
  } = useOperative(payrollNumber)

  const {
    summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useSummary(payrollNumber, bonusPeriod)

  if (isOperativeLoading) return <Spinner />
  if (isOperativeError || !operative)
    return (
      <NotFound>
        Couldn’t find an operative with the payroll number {payrollNumber}.
      </NotFound>
    )

  if (isSummaryLoading) return <Spinner />
  if (isSummaryError || !summary)
    return (
      <NotFound>
        Couldn’t find a summary for the bonus period beginning {bonusPeriod}.
      </NotFound>
    )

  const context = { operative, summary, week, bonusPeriod }

  // Add Sentry tags
  setTag('operative', operative.id)
  setTag('bonus_period', bonusPeriod)

  return (
    <PageContext.Provider value={context}>
      <BackButton href={backUrl || '/search'} />
      <OperativeSummary />
      <OperativeTabs current={0} backUrl={backUrl}>
        <BonusPeriodSummary />
      </OperativeTabs>
    </PageContext.Provider>
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

SummaryPage.permittedRoles = [OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE]

export default SummaryPage
