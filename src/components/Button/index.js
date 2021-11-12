import PropTypes from 'prop-types'
import cx from 'classnames'

const Button = ({ className, type, children, ...props }) => (
  <button
    type={type}
    className={cx('govuk-button lbh-button', className)}
    data-module="govuk-button"
    {...props}
  >
    {children}
  </button>
)

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
}

Button.defaultProps = {
  type: 'button',
}

export default Button
