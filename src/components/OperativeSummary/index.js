import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const OperativeSummary = () => {
  const { operative } = useContext(PageContext)

  return (
    <section className="section">
      <h1 className="lbh-heading-h2">{operative.name}</h1>

      <dl className="govuk-summary-list lbh-summary-list govuk-!-margin-top-5">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Employee No</dt>
          <dd className="govuk-summary-list__value">{operative.id}</dd>
          <dt className="govuk-summary-list__key">Section / Team</dt>
          <dd className="govuk-summary-list__value">{operative.section}</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Trade</dt>
          <dd className="govuk-summary-list__value">
            {operative.tradeDescription}
          </dd>
          <dt className="govuk-summary-list__key">Scheme</dt>
          <dd className="govuk-summary-list__value">{operative.schemeType}</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Salary Band</dt>
          <dd className="govuk-summary-list__value">{operative.salaryBand}</dd>
          <dt className="govuk-summary-list__key">Fixed Band</dt>
          <dd className="govuk-summary-list__value">
            {operative.fixedBand ? 'Yes' : 'No'}
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default OperativeSummary
