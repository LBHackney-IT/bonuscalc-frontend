import PropTypes from 'prop-types'
import Link from 'next/link'
import { Table, THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { Timesheet } from '@/models'
import { numberWithPrecision } from '@/utils/number'

const WorkOrders = ({ timesheet }) => {
  const repairsHubUrl = process.env.NEXT_PUBLIC_REPAIRS_HUB_URL

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
            SMV
          </TH>
        </TR>
      </THead>
      {timesheet.hasProductivePayElements ? (
        <>
          <TBody>
            {timesheet.productivePayElements.map((payElement, index) => (
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
                  {numberWithPrecision(payElement.value, 2)}
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
                {numberWithPrecision(timesheet.productiveTotal, 2)}
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

WorkOrders.propTypes = {
  timesheet: PropTypes.instanceOf(Timesheet).isRequired,
}

export default WorkOrders
