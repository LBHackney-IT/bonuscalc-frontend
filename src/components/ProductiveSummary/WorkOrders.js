import Link from 'next/link'
import PageContext from '@/components/PageContext'
import { Table, THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { numberWithPrecision } from '@/utils/number'
import { smvOrUnits } from '@/utils/scheme'
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
            {isUnitScheme ? 'Units' : 'SMVs'}
          </TH>
        </TR>
      </THead>
      {hasProductivePayElements ? (
        <>
          <TBody>
            {productivePayElements.map((payElement, index) => (
              <TR key={index}>
                <TD>
                  {payElement.workOrder ? (
                    <Link href={`${repairsHubUrl}/${payElement.workOrder}`}>
                      <a target="_blank" className="lbh-link">
                        {payElement.workOrder}
                      </a>
                    </Link>
                  ) : (
                    <>&ndash;</>
                  )}
                </TD>
                <TD>{payElement.address}</TD>
                <TD>{payElement.comment}</TD>
                <TD numeric={true}>
                  {numberWithPrecision(
                    smvOrUnits(scheme, payElement.value),
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
                  smvOrUnits(scheme, productiveTotal),
                  scheme.precision
                )}
              </TD>
            </TR>
          </TFoot>
        </>
      ) : (
        <TBody>
          <TR>
            <TD colSpan="4">There are no productive items for this week.</TD>
          </TR>
        </TBody>
      )}
    </Table>
  )
}

export default WorkOrders
