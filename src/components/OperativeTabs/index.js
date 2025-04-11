import PropTypes from 'prop-types'
import cx from 'classnames'
import Link from 'next/link'
import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const OperativeTabs = ({ current, children, backUrl }) => {
  const { operative, week, bonusPeriod } = useContext(PageContext)

  const baseUrl = `/operatives/${operative.id}`
  const summaryUrl = `${baseUrl}/summaries/${bonusPeriod}`
  const timesheetUrl = `${baseUrl}/timesheets/${week}`
  const query = backUrl ? `?backUrl=${backUrl}` : ''

  const tabs = [
    {
      content: 'Summary',
      href: `${summaryUrl}${query}`,
    },
    {
      content: 'Productive (P)',
      href: `${timesheetUrl}/productive${query}`,
    },
    {
      content: 'Non-productive (NP)',
      href: `${timesheetUrl}/non-productive${query}`,
    },
    {
      content: 'Out of hours',
      href: `${timesheetUrl}/out-of-hours${query}`,
    },
    {
      content: 'Overtime',
      href: `${timesheetUrl}/overtime${query}`,
    },
  ]

  return (
    <div
      className="govuk-tabs lbh-tabs govuk-!-margin-top-9"
      data-module="govuk-tabs"
    >
      <h2 className="govuk-tabs__title">Contents</h2>
      <ul className="govuk-tabs__list">
        {tabs.map(({ content, href }, index) => (
          <li
            key={href}
            className={cx(
              'govuk-tabs__list-item',
              current === index ? 'govuk-tabs__list-item--selected' : null
            )}
          >
            <Link href={href} className="govuk-tabs__tab">
              {content}
            </Link>
          </li>
        ))}
      </ul>
      <section className="govuk-tabs__panel">{children}</section>
    </div>
  )
}

OperativeTabs.propTypes = {
  current: PropTypes.number.isRequired,
  backUrl: PropTypes.string,
}

export default OperativeTabs
