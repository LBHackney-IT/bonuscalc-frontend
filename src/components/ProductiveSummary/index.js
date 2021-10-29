import PropTypes from 'prop-types'
import ErrorMessage from '../ErrorMessage'
import Spinner from '../Spinner'
import Header from './Header'
import Pagination from './Pagination'
import WorkOrders from './WorkOrders'
import Buttons from './Buttons'
import { Operative } from '@/models'
import { useTimesheet } from '@/utils/apiClient'

const ProductiveSummary = ({ operative, week }) => {
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
      <Pagination week={timesheet.week} baseUrl={baseUrl} />
      <WorkOrders timesheet={timesheet} />
      <Buttons />
    </>
  )
}

ProductiveSummary.propTypes = {
  operative: PropTypes.instanceOf(Operative).isRequired,
  week: PropTypes.string.isRequired,
}

export default ProductiveSummary
