import PropTypes from 'prop-types'
import Heading from './Heading'
import Summary from './Summary'
import Tabs from './Tabs'

const OperativeView = ({ operative }) => {
  return (
    <section className="section">
      <Heading operative={operative} />
      <Summary operative={operative} />
      <Tabs operative={operative} />
    </section>
  )
}

OperativeView.propTypes = {
  operative: PropTypes.object.isRequired,
}

export default OperativeView
