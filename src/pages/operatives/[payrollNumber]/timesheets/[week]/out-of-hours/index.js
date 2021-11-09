import PageContext from '@/components/PageContext'
import BackButton from '@/components/BackButton'
import OperativeSummary from '@/components/OperativeSummary'
import OperativeTabs from '@/components/OperativeTabs'
import OutOfHoursSummary from '@/components/OutOfHoursSummary'
import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import { BonusPeriod } from '@/models'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'
import { useOperative, useTimesheet } from '@/utils/apiClient'

const OperativePage = ({ query }) => {
  const { payrollNumber, week } = query
  const {
    operative,
    isLoading: isOperativeLoading,
    isError: isOperativeError,
  } = useOperative(payrollNumber)

  const {
    timesheet,
    isLoading: isTimesheetLoading,
    isError: isTimesheetError,
  } = useTimesheet(payrollNumber, week)

  if (isOperativeLoading) return <Spinner />
  if (isOperativeError || !operative)
    return (
      <NotFound
        message={`Couldn\u2019t find an operative with the payroll number ${payrollNumber}.`}
      />
    )

  if (isTimesheetLoading) return <Spinner />
  if (isTimesheetError || !timesheet)
    return (
      <NotFound
        message={`Couldn\u2019t find a timesheet for the week beginning ${week}.`}
      />
    )

  const bonusPeriod = BonusPeriod.forWeek(week)
  const context = { operative, timesheet, week, bonusPeriod }

  return (
    <PageContext.Provider value={context}>
      <BackButton href="/" />
      <OperativeSummary />
      <OperativeTabs current={3}>
        <OutOfHoursSummary />
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
