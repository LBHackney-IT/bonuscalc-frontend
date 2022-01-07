import PropTypes from 'prop-types'
import cx from 'classnames'
import React from 'react'

const Button = ({ className, type, children, ...props }, ref) => (
  <button
    type={type}
    className={cx('govuk-button lbh-button', className)}
    data-module="govuk-button"
    ref={ref}
    {...props}
  >
    {children}
  </button>
)

const ButtonRef = React.forwardRef(Button)

ButtonRef.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
}

ButtonRef.defaultProps = {
  type: 'button',
}

export default ButtonRef
