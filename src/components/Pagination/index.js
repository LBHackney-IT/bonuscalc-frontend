import PropTypes from 'prop-types'
import PreviousLink from '../PreviousLink'
import NextLink from '../NextLink'
import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const Pagination = ({ tab }) => {
  const { operative, timesheet } = useContext(PageContext)

  const baseUrl = `/operatives/${operative.id}/timesheets`
  const week = timesheet.week

  return (
    <nav className="lbh-simple-pagination govuk-!-margin-top-3">
      {week.isFirst ? (
        <span className="lbh-simple-pagination__link" />
      ) : (
        <PreviousLink href={`${baseUrl}/${week.previousDate}/${tab}`}>
          {week.previousDescription}
        </PreviousLink>
      )}
      {week.isLast ? (
        <span className="lbh-simple-pagination__link lbh-simple-pagination__link--next" />
      ) : (
        <NextLink href={`${baseUrl}/${week.nextDate}/${tab}`}>
          {week.nextDescription}
        </NextLink>
      )}
    </nav>
  )
}

Pagination.propTypes = {
  tab: PropTypes.string.isRequired,
}

export default Pagination
