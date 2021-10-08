import PropTypes from 'prop-types'

const Heading = ({ operative }) => {
  return <h2 className="lbh-heading-h2">{operative.name}</h2>
}

Heading.propTypes = {
  operative: PropTypes.object.isRequired,
}

export default Heading
