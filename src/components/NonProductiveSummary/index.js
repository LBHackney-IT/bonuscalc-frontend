import PropTypes from 'prop-types'
import NextLink from '../NextLink'
import PreviousLink from '../PreviousLink'
import { useOperative, useTimesheet } from '../../utils/apiClient'

const NonProductiveSummary = ({ payrollNumber, weekBeginning }) => {
  const { operative } = useOperative(payrollNumber)
  const { timesheet, isLoading, isError } = useTimesheet(
    payrollNumber,
    weekBeginning
  )

  if (!operative) return <></>
  if (isLoading || isError) return <></>

  const week = timesheet.week
  const baseUrl = `/operatives/${operative.id}/non-productive`

  return (
    <>
      <h3 className="lbh-heading-h3">{week.description}</h3>

      <nav className="lbh-simple-pagination govuk-!-margin-top-3">
        <PreviousLink href={week.previousUrl(baseUrl)}>
          {week.previousDescription}
        </PreviousLink>
        <NextLink href={week.nextUrl(baseUrl)}>{week.nextDescription}</NextLink>
      </nav>
    </>
  )
}

NonProductiveSummary.propTypes = {
  payrollNumber: PropTypes.string.isRequired,
  weekBeginning: PropTypes.string.isRequired,
}

export default NonProductiveSummary
