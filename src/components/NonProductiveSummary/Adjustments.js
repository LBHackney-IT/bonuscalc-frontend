import PropTypes from 'prop-types'
import { Table, THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { Timesheet } from '@/models'
import { numberWithPrecision } from '@/utils/number'

const Adjustments = ({ timesheet }) => {
  return (
    <Table id="adjustment-summary">
      <THead>
        <TR>
          <TH scope="col" colSpan="4">
            Adjustments
          </TH>
        </TR>
      </THead>
      <TBody>
        {timesheet.hasAdjustmentPayElements ? (
          timesheet.adjustmentPayElements.map((payElement, index) => (
            <TR key={index}>
              <TD width="two-tenths">{payElement.workOrder}</TD>
              <TD>{payElement.comment}</TD>
              <TD width="two-tenths" numeric={true}>
                &nbsp;
              </TD>
              <TD width="two-tenths" numeric={true}>
                {numberWithPrecision(payElement.value, 2)}
              </TD>
            </TR>
          ))
        ) : (
          <TR>
            <TD colSpan="4">There are no adjustments for this week.</TD>
          </TR>
        )}
      </TBody>
      <TFoot>
        <TR>
          <TH scope="row" align="right" colSpan="3">
            Total
          </TH>
          <TD width="two-tenths" numeric={true}>
            {numberWithPrecision(timesheet.nonProductiveAndAdjustmentTotal, 2)}
          </TD>
        </TR>
      </TFoot>
    </Table>
  )
}

Adjustments.propTypes = {
  timesheet: PropTypes.instanceOf(Timesheet).isRequired,
}

export default Adjustments
