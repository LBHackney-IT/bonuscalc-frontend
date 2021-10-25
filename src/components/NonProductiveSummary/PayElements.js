import PropTypes from 'prop-types'
import { Timesheet } from '@/models'
import { numberWithPrecision } from '@/utils/number'

const PayElements = ({ timesheet }) => {
  return (
    <table className="govuk-table lbh-table" id="non-productive-summary">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            Pay elements
          </th>
          <th
            scope="col"
            className="govuk-table__header govuk-table__header--numeric"
          >
            Hours (AT)
          </th>
          <th
            scope="col"
            className="govuk-table__header govuk-table__header--numeric"
          >
            SMV
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {timesheet.hasNonProductivePayElements ? (
          timesheet.nonProductivePayElements.map((payElement, index) => (
            <tr className="govuk-table__row" key={index}>
              <td className="govuk-table__cell">{payElement.description}</td>
              <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-width-two-tenths">
                {numberWithPrecision(payElement.duration, 2)}
              </td>
              <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-width-two-tenths">
                {numberWithPrecision(payElement.value, 2)}
              </td>
            </tr>
          ))
        ) : (
          <tr className="govuk-table__row">
            <td className="govuk-table__cell" colSpan="3">
              There are no non-productive items for this week.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

PayElements.propTypes = {
  timesheet: PropTypes.instanceOf(Timesheet).isRequired,
}

export default PayElements
