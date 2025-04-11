import Link from 'next/link'
import PageContext from '@/components/PageContext'
import { Table, THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { numberWithPrecision } from '@/utils/number'
import { smvhOrUnits } from '@/utils/scheme'
import { useContext } from 'react'

const WorkOrders = () => {
  const repairsHubUrl = process.env.NEXT_PUBLIC_REPAIRS_HUB_URL

  const {
    operative: { scheme, isUnitScheme },
    timesheet: {
      hasProductivePayElements,
      productivePayElements,
      productiveTotal,
    },
  } = useContext(PageContext)

  return (
    <>
      {hasProductivePayElements && (
        <Table id="productive-summary">
          <THead>
            <TR>
              <TH scope="col" width="two-tenths">
                Reference
              </TH>
              <TH scope="col" width="three-tenths">
                Address
              </TH>
              <TH scope="col" width="four-tenths">
                Description
              </TH>
              <TH scope="col" width="one-tenth" numeric={true}>
                {isUnitScheme ? 'Units' : 'SMVh'}
              </TH>
            </TR>
          </THead>
          <TBody>
            {productivePayElements.map((payElement, index) => (
              <TR key={index}>
                <TD>
                  {payElement.workOrder ? (
                    <Link
                      href={`${repairsHubUrl}/${payElement.workOrder}`}
                      target="_blank"
                      className="lbh-link">

                      {payElement.workOrder}

                    </Link>
                  ) : (
                    <>&ndash;</>
                  )}
                </TD>
                <TD>{payElement.address}</TD>
                <TD>{payElement.comment}</TD>
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
              <TH scope="row" colSpan="3" align="right">
                Total
              </TH>
              <TD numeric={true}>
                {numberWithPrecision(
                  smvhOrUnits(scheme, productiveTotal),
                  scheme.precision
                )}
              </TD>
            </TR>
          </TFoot>
        </Table>
      )}
    </>
  );
}

export default WorkOrders
