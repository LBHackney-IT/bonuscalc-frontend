import PropTypes from 'prop-types'
import { Operative, Week } from '@/models'

const Header = ({ operative, week }) => {
  return (
    <section className="section">
      <h1 className="lbh-heading-h2">
        <span className="govuk-caption-l lbh-caption">{operative.name}</span>
        Edit additional time
      </h1>
      <h2 className="lbh-heading-h3 govuk-!-margin-top-2">
        {week.description}
        <span className="govuk-caption-m lbh-caption">({week.dateRange})</span>
      </h2>
    </section>
  )
}

Header.propTypes = {
  operative: PropTypes.instanceOf(Operative).isRequired,
  week: PropTypes.instanceOf(Week).isRequired,
}

export default Header
