import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const Header = () => {
  const {
    timesheet: { week },
  } = useContext(PageContext)

  return (
    <h3 className="lbh-heading-h3">
      {week.description}
      <span className="govuk-caption-m lbh-caption govuk-!-display-inline-block govuk-!-margin-left-3">
        ({week.dateRange})
      </span>
    </h3>
  )
}

export default Header
