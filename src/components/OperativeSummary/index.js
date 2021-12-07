import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const OperativeSummary = () => {
  const { operative } = useContext(PageContext)

  return (
    <section className="section">
      <h1 className="lbh-heading-h2">
        {operative.name}
        {operative.isArchived && (
          <span className="govuk-caption-m lbh-caption govuk-!-display-inline-block govuk-!-margin-left-3">
            (Archived)
          </span>
        )}
      </h1>

      <dl className="govuk-summary-list lbh-summary-list govuk-!-margin-top-5">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key govuk-!-width-one-third">
            Employee No
          </dt>
          <dd className="govuk-summary-list__value">{operative.id}</dd>
          <dt className="govuk-summary-list__key govuk-!-width-one-third">
            Section / Team
          </dt>
          <dd className="govuk-summary-list__value">{operative.section}</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key govuk-!-width-one-third">
            Trade
          </dt>
          <dd className="govuk-summary-list__value">
            {operative.tradeDescription}
          </dd>
          <dt className="govuk-summary-list__key govuk-!-width-one-third">
            Scheme
          </dt>
          <dd className="govuk-summary-list__value">
            {operative.schemeDescription}
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key govuk-!-width-one-third">
            Salary Band
          </dt>
          <dd className="govuk-summary-list__value">{operative.salaryBand}</dd>
          <dt className="govuk-summary-list__key govuk-!-width-one-third">
            Fixed Band
          </dt>
          <dd className="govuk-summary-list__value">
            {operative.fixedBand ? 'Yes' : 'No'}
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default OperativeSummary
