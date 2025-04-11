import PropTypes from 'prop-types'
import Link from 'next/link'

const NextLink = ({ href, children }) => (
  <Link
    href={href}
    className="lbh-simple-pagination__link lbh-simple-pagination__link--next"
  >
    <span className="lbh-simple-pagination__title">{children}</span>
    <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
      <path d="M1 18L9 9.5L1 1" strokeWidth="2"></path>
    </svg>
  </Link>
)

NextLink.propTypes = {
  href: PropTypes.string.isRequired,
}

export default NextLink
