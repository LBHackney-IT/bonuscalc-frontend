import cx from 'classnames'
import Link from 'next/link'
import { useOperative } from '@/utils/apiClient'

const OperativeTabs = ({ payrollNumber, tabIndex, children }) => {
  const { operative, isLoading, isError } = useOperative(payrollNumber)

  if (isLoading || isError) return <></>

  const tabs = [
    {
      content: 'Summary',
      href: `/operatives/${operative.id}`,
    },
    {
      content: 'Productive (P)',
      href: `/operatives/${operative.id}/productive`,
    },
    {
      content: 'Non-productive (NP)',
      href: `/operatives/${operative.id}/non-productive`,
    },
    {
      content: 'Out of hours',
      href: `/operatives/${operative.id}/out-of-hours`,
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
              tabIndex === index ? 'govuk-tabs__list-item--selected' : null
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

export default OperativeTabs
