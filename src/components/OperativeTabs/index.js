import PropTypes from 'prop-types'
import cx from 'classnames'
import Link from 'next/link'
import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const OperativeTabs = ({ current, children }) => {
  const { operative, week, bonusPeriod } = useContext(PageContext)

  const tabs = [
    {
      content: 'Summary',
      href: `/operatives/${operative.id}/summaries/${bonusPeriod}`,
    },
    {
      content: 'Productive (P)',
      href: `/operatives/${operative.id}/timesheets/${week}/productive`,
    },
    {
      content: 'Non-productive (NP)',
      href: `/operatives/${operative.id}/timesheets/${week}/non-productive`,
    },
    {
      content: 'Out of hours',
      href: `/operatives/${operative.id}/timesheets/${week}/out-of-hours`,
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
            <Link href={href}>
              <a className="govuk-tabs__tab">{content}</a>
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
}

export default OperativeTabs
