import PropTypes from 'prop-types'
import { TradeDescriptions } from '../../utils/trades'

const Summary = ({ operative }) => {
  return (
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
          {TradeDescriptions[operative.trade]} ({operative.trade})
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
  )
}

Summary.propTypes = {
  operative: PropTypes.object.isRequired,
}

export default Summary
