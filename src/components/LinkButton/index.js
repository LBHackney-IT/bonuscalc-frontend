import PropTypes from 'prop-types'
import cx from 'classnames'

const LinkButton = ({ type, className, children, ...props }) => (
  <button type={type} className={cx('lbh-link', className)} {...props}>
    {children}
  </button>
)

LinkButton.propTypes = {
  className: PropTypes.string,
}

LinkButton.defaultProps = {
  type: 'button',
  className: 'govuk-!-font-size-16',
}

export default LinkButton
