import PropTypes from 'prop-types'
import { Timesheet } from '@/models'
import { numberWithPrecision } from '@/utils/number'

const Adjustments = ({ timesheet }) => {
  return (
    <table className="govuk-table lbh-table" id="adjustment-summary">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th
            scope="col"
            className="govuk-table__header govuk-!-width-two-tenths"
          >
            Adjustments
          </th>
          <th
            scope="col"
            className="govuk-table__header govuk-table__header--numeric"
          >
            &nbsp;
          </th>
          <th
            scope="col"
            className="govuk-table__header govuk-table__header--numeric govuk-!-width-two-tenths"
          >
            &nbsp;
          </th>
          <th
            scope="col"
            className="govuk-table__header govuk-table__header--numeric govuk-!-width-two-tenths"
          >
            &nbsp;
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {timesheet.hasAdjustmentPayElements ? (
          timesheet.adjustmentPayElements.map((payElement, index) => (
            <tr className="govuk-table__row" key={index}>
              <td className="govuk-table__cell govuk-!-width-two-tenths">
                {payElement.workOrder}
              </td>
              <td className="govuk-table__cell">{payElement.comment}</td>
              <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-width-two-tenths">
                &nbsp;
              </td>
              <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-width-two-tenths">
                {numberWithPrecision(payElement.value, 2)}
              </td>
            </tr>
          ))
        ) : (
          <tr className="govuk-table__row">
            <td className="govuk-table__cell" colSpan="4">
              There are no adjustments for this week.
            </td>
          </tr>
        )}
      </tbody>
      <tfoot className="govuk-table__foot">
        <tr className="govuk-table__row">
          <td colSpan="2">&nbsp;</td>
          <td className="govuk-table__header govuk-table__header--numeric govuk-!-width-two-tenths">
            Total
          </td>
          <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-width-two-tenths">
            {numberWithPrecision(timesheet.nonProductiveAndAdjustmentTotal, 2)}
          </td>
        </tr>
      </tfoot>
    </table>
  )
}

Adjustments.propTypes = {
  timesheet: PropTypes.instanceOf(Timesheet).isRequired,
}

export default Adjustments
