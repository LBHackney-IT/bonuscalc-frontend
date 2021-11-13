import PageContext from '@/components/PageContext'
import { Table, THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { numberWithPrecision } from '@/utils/number'
import { smvhOrUnits } from '@/utils/scheme'
import { useContext } from 'react'

const Adjustments = () => {
  const {
    operative: { scheme, isUnitScheme },
    timesheet: {
      hasAdjustmentPayElements,
      adjustmentPayElements,
      adjustmentTotal,
    },
  } = useContext(PageContext)

  return (
    <>
      {hasAdjustmentPayElements && (
        <Table id="adjustment-summary">
          <THead>
            <TR>
              <TH scope="col">Productive not on Repairs Hub</TH>
              <TH scope="col" width="one-tenth" numeric={true}>
                {isUnitScheme ? 'Units' : 'SMVh'}
              </TH>
            </TR>
          </THead>
          <TBody>
            {adjustmentPayElements.map((payElement, index) => (
              <TR key={index}>
                <TD>
                  <p className="lbh-body-m">{payElement.description}</p>
                  {payElement.comment && (
                    <p className="lbh-body-s govuk-!-margin-top-0">
                      {payElement.comment}
                    </p>
                  )}
                </TD>
                <TD numeric={true}>
                  {numberWithPrecision(
                    smvhOrUnits(scheme, payElement.value),
                    scheme.precision
                  )}
                </TD>
              </TR>
            ))}
          </TBody>
          <TFoot>
            <TR>
              <TH scope="row" align="right">
                Total
              </TH>
              <TD numeric={true}>
                {numberWithPrecision(
                  smvhOrUnits(scheme, adjustmentTotal),
                  scheme.precision
                )}
              </TD>
            </TR>
          </TFoot>
        </Table>
      )}
    </>
  )
}

export default Adjustments
