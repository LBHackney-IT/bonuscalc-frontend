import PageContext from '@/components/PageContext'
import BackButton from '@/components/BackButton'
import OperativeSummary from '@/components/OperativeSummary'
import OperativeTabs from '@/components/OperativeTabs'
import BonusPeriodSummary from '@/components/BonusPeriodSummary'
import NotFound from '@/components/NotFound'
import Spinner from '@/components/Spinner'
import { Week } from '@/models'
import { useOperative, useSummary } from '@/utils/apiClient'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'

const OperativePage = ({ query }) => {
  const { payrollNumber, bonusPeriod } = query
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

  return (
    <PageContext.Provider value={context}>
      <BackButton href="/" />
      <OperativeSummary />
      <OperativeTabs current={0}>
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

OperativePage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default OperativePage
