import PropTypes from 'prop-types'
import ErrorMessage from '../ErrorMessage'
import Spinner from '../Spinner'
import Header from './Header'
import Body from './Body'
import { Operative } from '@/models'
import { useTimesheet } from '@/utils/apiClient'

const EditNonProductive = ({ operative, week }) => {
  const { timesheet, isLoading, isError } = useTimesheet(operative.id, week)

  if (isLoading) return <Spinner />
  if (isError || !timesheet)
    return (
      <ErrorMessage
        description={`Couldn\u2019t find a timesheet for the week beginning ${week}.`}
      />
    )

  return (
    <>
      <Header operative={operative} week={timesheet.week} />
      <Body operative={operative} timesheet={timesheet} />
    </>
  )
}

EditNonProductive.propTypes = {
  operative: PropTypes.instanceOf(Operative).isRequired,
  week: PropTypes.string.isRequired,
}

export default EditNonProductive
