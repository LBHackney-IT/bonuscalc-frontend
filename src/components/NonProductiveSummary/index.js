import PropTypes from 'prop-types'
import ErrorMessage from '../ErrorMessage'
import Spinner from '../Spinner'
import Header from './Header'
import Pagination from './Pagination'
import PayElements from './PayElements'
import Adjustments from './Adjustments'
import Buttons from './Buttons'
import { Operative } from '@/models'
import { useTimesheet } from '@/utils/apiClient'

const NonProductiveSummary = ({ operative, week }) => {
  const { timesheet, isLoading, isError } = useTimesheet(operative.id, week)
  const baseUrl = `/operatives/${operative.id}/timesheets`

  return (
    <>
      {isLoading && <Spinner />}
      {isError && (
        <ErrorMessage
          description={`Couldn\u2019t find a timesheet for the week beginning ${week}.`}
        />
      )}
      {timesheet && (
        <>
          <Header week={timesheet.week} />
          <Pagination week={timesheet.week} baseUrl={baseUrl} />
          <PayElements timesheet={timesheet} />
          <Adjustments timesheet={timesheet} />
          <Buttons week={timesheet.week} />
        </>
      )}
    </>
  )
}

NonProductiveSummary.propTypes = {
  operative: PropTypes.instanceOf(Operative).isRequired,
  week: PropTypes.string.isRequired,
}

export default NonProductiveSummary
