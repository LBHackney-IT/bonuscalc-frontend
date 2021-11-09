import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const Header = () => {
  const {
    summary: { bonusPeriod },
  } = useContext(PageContext)

  return (
    <h3 className="lbh-heading-h3">
      {bonusPeriod.description}
      <span className="govuk-caption-m lbh-caption govuk-!-display-inline-block govuk-!-margin-left-3">
        ({bonusPeriod.dateRange})
      </span>
    </h3>
  )
}

export default Header
