import PropTypes from 'prop-types'
import PreviousLink from '../PreviousLink'
import NextLink from '../NextLink'
import dayjs from '@/utils/date'
import { Week } from '@/models'

const Pagination = ({ week, baseUrl, tab }) => {
  const firstWeek = dayjs(process.env.NEXT_PUBLIC_FIRST_WEEK)
  const lastWeek = dayjs(process.env.NEXT_PUBLIC_LAST_WEEK)

  return (
    <nav className="lbh-simple-pagination govuk-!-margin-top-3">
      {firstWeek.isSameOrBefore(week.previous) ? (
        <PreviousLink href={`${baseUrl}/${week.previousDate}/${tab}`}>
          {week.previousDescription}
        </PreviousLink>
      ) : (
        <span className="lbh-simple-pagination__link" />
      )}
      {lastWeek.isSameOrAfter(week.next) ? (
        <NextLink href={`${baseUrl}/${week.nextDate}/${tab}`}>
          {week.nextDescription}
        </NextLink>
      ) : (
        <span className="lbh-simple-pagination__link lbh-simple-pagination__link--next" />
      )}
    </nav>
  )
}

Pagination.propTypes = {
  week: PropTypes.instanceOf(Week).isRequired,
  baseUrl: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
}

export default Pagination