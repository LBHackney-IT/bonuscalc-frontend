import PropTypes from 'prop-types'
import NextLink from '../NextLink'
import PreviousLink from '../PreviousLink'
import Spinner from '../Spinner'
import { useOperative, useTimesheet } from '@/utils/apiClient'
import { numberWithPrecision } from '@/utils/number'

const NonProductiveSummary = ({ payrollNumber, weekBeginning }) => {
  const { operative } = useOperative(payrollNumber)
  const { timesheet, isLoading, isError } = useTimesheet(
    payrollNumber,
    weekBeginning
  )

  if (!operative) return <></>
  if (isError) return <></>
  if (isLoading) return <Spinner />

  const week = timesheet.week
  const baseUrl = `/operatives/${operative.id}/non-productive`

  return (
    <>
      <h3 className="lbh-heading-h3">{week.description}</h3>

      <nav className="lbh-simple-pagination govuk-!-margin-top-3">
        <PreviousLink href={week.previousUrl(baseUrl)}>
          {week.previousDescription}
        </PreviousLink>
        <NextLink href={week.nextUrl(baseUrl)}>{week.nextDescription}</NextLink>
      </nav>

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
              {numberWithPrecision(
                timesheet.nonProductiveAndAdjustmentTotal,
                2
              )}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="govuk-button-group">
        <button className="govuk-button lbh-button" data-module="govuk-button">
          Download report
        </button>

        {week.isEditable && (
          <button
            className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
            data-module="govuk-button"
          >
            Edit non-productive
          </button>
        )}
      </div>
    </>
  )
}

NonProductiveSummary.propTypes = {
  payrollNumber: PropTypes.string.isRequired,
  weekBeginning: PropTypes.string.isRequired,
}

export default NonProductiveSummary
