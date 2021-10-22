import PropTypes from 'prop-types'
import { useOperative } from '@/utils/apiClient'
import NotFound from '../NotFound'
import Spinner from '../Spinner'

const OperativeSummary = ({ payrollNumber }) => {
  const { operative, isLoading, isError } = useOperative(payrollNumber)

  if (isLoading) return <Spinner />
  if (isError)
    return (
      <NotFound
        message={`Couldn\u2019t find an operative with the payroll number ${payrollNumber}.`}
      />
    )

  return (
    <section className="section">
      <h2 className="lbh-heading-h2">{operative.name}</h2>

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
          <dd className="govuk-summary-list__value">{operative.scheme}</dd>
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

OperativeSummary.propTypes = {
  payrollNumber: PropTypes.string.isRequired,
}

export default OperativeSummary
