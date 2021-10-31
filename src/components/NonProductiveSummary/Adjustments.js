import PageContext from '@/components/PageContext'
import { useContext } from 'react'
import { Table, THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { numberWithPrecision } from '@/utils/number'

const Adjustments = () => {
  const {
    timesheet: {
      hasAdjustmentPayElements,
      adjustmentPayElements,
      nonProductiveAndAdjustmentTotal,
    },
  } = useContext(PageContext)

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
            {numberWithPrecision(nonProductiveAndAdjustmentTotal, 2)}
          </TD>
        </TR>
      </TFoot>
    </Table>
  )
}

export default Adjustments
