import Link from 'next/link'

const BackButton = ({ href }) => (
  <Link href={href}>
    <a className="govuk-back-link lbh-back-link" role="button">
      Back
    </a>
  </Link>
)

export default BackButton
