import PageContext from '@/components/PageContext'
import { useContext } from 'react'
import { Table, THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { numberWithPrecision, round } from '@/utils/number'
import { smvhOrUnits } from '@/utils/scheme'

const PayElements = () => {
  const {
    operative: { scheme, isUnitScheme },
    timesheet: { hasNonProductivePayElements, nonProductivePayElements },
  } = useContext(PageContext)

  const totalDuration = hasNonProductivePayElements
    ? nonProductivePayElements.reduce((sum, pe) => {
        return sum + round(pe.duration, 2)
      }, 0)
    : 0

  const totalValue = hasNonProductivePayElements
    ? nonProductivePayElements.reduce((sum, pe) => {
        return sum + round(smvhOrUnits(scheme, pe.value), 2)
      }, 0)
    : 0

  return (
    <Table id="non-productive-summary">
      <THead>
        <TR>
          <TH scope="col">Pay elements</TH>
          <TH scope="col" numeric={true}>
            Hours (AT)
          </TH>
          <TH scope="col" numeric={true}>
            {isUnitScheme ? 'Units' : 'SMVh'}
          </TH>
        </TR>
      </THead>
      <TBody>
        {hasNonProductivePayElements ? (
          nonProductivePayElements.map((payElement, index) => (
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
                {numberWithPrecision(smvhOrUnits(scheme, payElement.value), 2)}
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
      <TFoot>
        <TR>
          <TH scope="row" align="right">
            Total
          </TH>
          <TD width="two-tenths" numeric={true}>
            {numberWithPrecision(totalDuration, 2)}
          </TD>
          <TD width="two-tenths" numeric={true}>
            {numberWithPrecision(totalValue, 2)}
          </TD>
        </TR>
      </TFoot>
    </Table>
  )
}

export default PayElements
