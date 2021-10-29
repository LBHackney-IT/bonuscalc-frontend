import PropTypes from 'prop-types'
import { Table, THead, TBody, TR, TH, TD } from '@/components/Table'
import { Timesheet } from '@/models'
import { numberWithPrecision } from '@/utils/number'

const PayElements = ({ timesheet }) => {
  return (
    <Table id="non-productive-summary">
      <THead>
        <TR>
          <TH scope="col">Pay elements</TH>
          <TH scope="col" numeric={true}>
            Hours (AT)
          </TH>
          <TH scope="col" numeric={true}>
            SMV
          </TH>
        </TR>
      </THead>
      <TBody>
        {timesheet.hasNonProductivePayElements ? (
          timesheet.nonProductivePayElements.map((payElement, index) => (
            <TR key={index}>
              <TD>
                <p className="lbh-body-m">{payElement.description}</p>
                {payElement.comment && (
                  <p className="lbh-body-s govuk-!-margin-top-0">
                    {payElement.comment}
                  </p>
                )}
              </TD>
              <TD numeric={true} width="two-tenths">
                {numberWithPrecision(payElement.duration, 2)}
              </TD>
              <TD numeric={true} width="two-tenths">
                {numberWithPrecision(payElement.value, 2)}
              </TD>
            </TR>
          ))
        ) : (
          <TR>
            <TD colSpan="3">
              There are no non-productive items for this week.
            </TD>
          </TR>
        )}
      </TBody>
    </Table>
  )
}

PayElements.propTypes = {
  timesheet: PropTypes.instanceOf(Timesheet).isRequired,
}

export default PayElements
