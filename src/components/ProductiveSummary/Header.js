import PropTypes from 'prop-types'
import { Week } from '@/models'

const Header = ({ week }) => {
  return <h3 className="lbh-heading-h3">{week.description}</h3>
}

Header.propTypes = {
  week: PropTypes.instanceOf(Week).isRequired,
}

export default Header
