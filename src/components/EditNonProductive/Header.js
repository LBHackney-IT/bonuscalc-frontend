import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const Header = () => {
  const {
    operative,
    timesheet: { week },
  } = useContext(PageContext)

  return (
    <section className="section">
      <h1 className="lbh-heading-h2">
        <span className="govuk-caption-l lbh-caption">{operative.name}</span>
        Edit additional time
      </h1>
      <h2 className="lbh-heading-h3 govuk-!-margin-top-2">
        {week.description}
        <span className="govuk-caption-m lbh-caption">({week.dateRange})</span>
      </h2>
    </section>
  )
}

export default Header
