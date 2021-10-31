import PageContext from '@/components/PageContext'
import { useContext } from 'react'
import { Table, THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { numberWithPrecision, round } from '@/utils/number'
import { smvhOrUnits } from '@/utils/scheme'

const Adjustments = () => {
  const {
    operative: { scheme },
    timesheet: {
      hasNonProductivePayElements,
      nonProductivePayElements,
      hasAdjustmentPayElements,
      adjustmentPayElements,
    },
  } = useContext(PageContext)

  const sumPayElements = (payElements) => {
    return payElements.reduce((sum, pe) => {
      return sum + round(smvhOrUnits(scheme, pe.value), 2)
    }, 0)
  }

  const nonProductiveTotal = hasNonProductivePayElements
    ? sumPayElements(nonProductivePayElements)
    : 0

  const adjustmentTotal = hasAdjustmentPayElements
    ? sumPayElements(adjustmentPayElements)
    : 0

  const total = round(nonProductiveTotal + adjustmentTotal, 2)

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
        {hasAdjustmentPayElements ? (
          adjustmentPayElements.map((payElement, index) => (
            <TR key={index}>
              <TD width="two-tenths">{payElement.workOrder}</TD>
              <TD>{payElement.comment}</TD>
              <TD width="two-tenths" numeric={true}>
                &nbsp;
              </TD>
              <TD width="two-tenths" numeric={true}>
                {numberWithPrecision(smvhOrUnits(scheme, payElement.value), 2)}
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
            {numberWithPrecision(total, 2)}
          </TD>
        </TR>
      </TFoot>
    </Table>
  )
}

export default Adjustments
