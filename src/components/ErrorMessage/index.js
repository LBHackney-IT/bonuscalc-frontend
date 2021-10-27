import PropTypes from 'prop-types'

const ErrorMessage = ({ description }) => (
  <span className="govuk-error-message lbh-error-message">
    <span className="govuk-visually-hidden">Error:</span> {description}
  </span>
)

ErrorMessage.propTypes = {
  description: PropTypes.string.isRequired,
}

export default ErrorMessage
