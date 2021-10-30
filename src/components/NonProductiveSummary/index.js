import PropTypes from 'prop-types'
import ErrorMessage from '../ErrorMessage'
import Spinner from '../Spinner'
import Header from './Header'
import PayElements from './PayElements'
import Adjustments from './Adjustments'
import Buttons from './Buttons'
import Pagination from '@/components/Pagination'
import { Operative } from '@/models'
import { useTimesheet } from '@/utils/apiClient'

const NonProductiveSummary = ({ operative, week }) => {
  const { timesheet, isLoading, isError } = useTimesheet(operative.id, week)
  const baseUrl = `/operatives/${operative.id}/timesheets`

  if (isLoading) return <Spinner />
  if (isError || !timesheet)
    return (
      <ErrorMessage
        description={`Couldn\u2019t find a timesheet for the week beginning ${week}.`}
      />
    )

  return (
    <>
      <Header week={timesheet.week} />
      <Pagination
        week={timesheet.week}
        baseUrl={baseUrl}
        tab="non-productive"
      />
      <PayElements timesheet={timesheet} />
      <Adjustments timesheet={timesheet} />
      <Buttons week={timesheet.week} baseUrl={baseUrl} />
    </>
  )
}

NonProductiveSummary.propTypes = {
  operative: PropTypes.instanceOf(Operative).isRequired,
  week: PropTypes.string.isRequired,
}

export default NonProductiveSummary
