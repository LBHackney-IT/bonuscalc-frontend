import PropTypes from 'prop-types'
import PageContext from '@/components/PageContext'
import BackButton from '@/components/BackButton'
import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import { setTag } from '@sentry/nextjs'
import { BonusPeriod } from '@/models'
import {
  useOperative,
  usePayElementTypes,
  useTimesheet,
} from '@/utils/apiClient'

const EditOperativePage = ({
  query,
  tab,
  selectPayElements,
  selectPayElementTypes,
  component,
}) => {
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

  const {
    payElementTypes: allPayElementTypes,
    isLoading: isPayElementTypesLoading,
    isError: isPayElementTypesError,
  } = usePayElementTypes()

  if (isOperativeLoading) return <Spinner />
  if (isOperativeError || !operative)
    return (
      <NotFound>
        Couldn’t find an operative with the payroll number {payrollNumber}.
      </NotFound>
    )

  const bonusPeriod = BonusPeriod.forWeek(week)
  const baseUrl = `/operatives/${operative.id}`
  const backUrl = `${baseUrl}/timesheets/${week}/${tab}`

  if (operative.isArchived)
    return (
      <>
        <BackButton href={backUrl} />
        <section>
          <h1 className="lbh-heading-h1">Access Denied</h1>
          <p className="lbh-body">
            Sorry, {operative.name} has been archived and is no longer editable.
          </p>
        </section>
      </>
    )

  if (isTimesheetLoading) return <Spinner />
  if (isTimesheetError || !timesheet)
    return <NotFound>Couldn’t find a timesheet for the date {week}.</NotFound>

  if (isPayElementTypesLoading) return <Spinner />
  if (isPayElementTypesError || !allPayElementTypes)
    return <NotFound>Couldn’t fetch the list of pay element types.</NotFound>

  const payElements = selectPayElements(timesheet)
  const payElementTypes = selectPayElementTypes(allPayElementTypes)

  // Add Sentry tags
  setTag('operative', operative.id)
  setTag('bonus_period', bonusPeriod)
  setTag('week', week)
  setTag('timesheet', timesheet.id)

  const context = {
    operative,
    timesheet,
    payElements,
    payElementTypes,
    bonusPeriod,
    week,
  }

  return (
    <PageContext.Provider value={context}>
      <BackButton href={backUrl} />
      <ComponentToRender />
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

EditOperativePage.propTypes = {
  query: PropTypes.object.isRequired,
  tab: PropTypes.string.isRequired,
  selectPayElements: PropTypes.func.isRequired,
  selectPayElementTypes: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
}

export default EditOperativePage
