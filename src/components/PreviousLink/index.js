import PropTypes from 'prop-types'
import Link from 'next/link'

const PreviousLink = ({ href, children }) => (
  <Link href={href} className="lbh-simple-pagination__link">

    <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
      <path d="M10 1L2 9.5L10 18" strokeWidth="2"></path>
    </svg>
    <span className="lbh-simple-pagination__title">{children}</span>

  </Link>
)

PreviousLink.propTypes = {
  href: PropTypes.string.isRequired,
}

export default PreviousLink
