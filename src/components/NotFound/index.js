import PropTypes from 'prop-types'

const NotFound = ({ message }) => (
  <section className="section">
    <h1 className="lbh-heading-h1">Not Found</h1>
    <p className="lbh-body">{message}</p>
  </section>
)

NotFound.propTypes = {
  message: PropTypes.string.isRequired,
}

export default NotFound
