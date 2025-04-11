import Link from 'next/link'

const BackButton = ({ href }) => (
  <Link href={href} className="govuk-back-link lbh-back-link" role="button">
    Back
  </Link>
)

export default BackButton
