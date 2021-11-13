import PropTypes from 'prop-types'
import cx from 'classnames'
import Link from 'next/link'

const ButtonLink = ({ href, className, secondary, children, ...props }) => (
  <Link href={href}>
    <a
      role="button"
      draggable="false"
      data-module="govuk-button"
      className={cx(
        'govuk-button lbh-button',
        {
          'govuk-secondary lbh-button--secondary': secondary,
        },
        className
      )}
      {...props}
    >
      {children}
    </a>
  </Link>
)

ButtonLink.propTypes = {
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  secondary: PropTypes.bool,
}

ButtonLink.defaultProps = {
  secondary: false,
}

export default ButtonLink
