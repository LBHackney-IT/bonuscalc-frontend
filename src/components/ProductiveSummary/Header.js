import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const Header = () => {
  const {
    timesheet: { week },
  } = useContext(PageContext)

  return (
    <h3 className="lbh-heading-h3">
      <span className="govuk-!-display-inline-block govuk-!-margin-right-3">
        {week.description}
      </span>
      <span className="govuk-caption-m lbh-caption govuk-!-margin-top-0 govuk-!-display-inline-block">
        ({week.dateRange})
      </span>
    </h3>
  )
}

export default Header
