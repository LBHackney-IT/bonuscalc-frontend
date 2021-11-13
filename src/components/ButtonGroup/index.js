import PropTypes from 'prop-types'
import cx from 'classnames'

const ButtonGroup = ({ className, children }) => (
  <div className={cx('govuk-button-group', className)}>{children}</div>
)

ButtonGroup.propTypes = {
  className: PropTypes.string,
}

export default ButtonGroup
