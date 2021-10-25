import PropTypes from 'prop-types'
import PreviousLink from '../PreviousLink'
import NextLink from '../NextLink'
import { Week } from '@/models'

const Pagination = ({ week, baseUrl }) => {
  return (
    <nav className="lbh-simple-pagination govuk-!-margin-top-3">
      <PreviousLink href={`${baseUrl}/${week.previousDate}/non-productive`}>
        {week.previousDescription}
      </PreviousLink>
      <NextLink href={`${baseUrl}/${week.nextDate}/non-productive`}>
        {week.nextDescription}
      </NextLink>
    </nav>
  )
}

Pagination.propTypes = {
  week: PropTypes.instanceOf(Week).isRequired,
  baseUrl: PropTypes.string.isRequired,
}

export default Pagination
