import PropTypes from 'prop-types'
import PageContext from '@/components/PageContext'
import BackButton from '@/components/BackButton'
import OperativeSummary from '@/components/OperativeSummary'
import OperativeTabs from '@/components/OperativeTabs'
import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import { setTag } from '@sentry/nextjs'
import { BonusPeriod } from '@/models'
import { useOperative, useTimesheet } from '@/utils/apiClient'

const OperativePage = ({ query, tab, component }) => {
  const ComponentToRender = component

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
      <NotFound>
        Couldn’t find an operative with the payroll number {payrollNumber}.
      </NotFound>
    )

  if (isTimesheetLoading) return <Spinner />
  if (isTimesheetError || !timesheet)
    return <NotFound>Couldn’t find a timesheet for the date {week}.</NotFound>

  const bonusPeriod = BonusPeriod.forWeek(week)
  const context = { operative, timesheet, week, bonusPeriod }

  // Add Sentry tags
  setTag('operative', operative.id)
  setTag('bonus_period', bonusPeriod)
  setTag('week', week)
  setTag('timesheet', timesheet.id)

  return (
    <PageContext.Provider value={context}>
      <BackButton href="/search" />
      <OperativeSummary />
      <OperativeTabs current={tab}>
        <ComponentToRender />
      </OperativeTabs>
    </PageContext.Provider>
  )
}

OperativePage.propTypes = {
  query: PropTypes.object.isRequired,
  tab: PropTypes.number.isRequired,
  component: PropTypes.func.isRequired,
}

export default OperativePage
