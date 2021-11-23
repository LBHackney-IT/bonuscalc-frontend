import Link from 'next/link'
import PageContext from '@/components/PageContext'
import { Table, THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { useContext } from 'react'
import { numberWithPrecision } from '@/utils/number'

const OutOfHoursJobs = () => {
  const repairsHubUrl = process.env.NEXT_PUBLIC_REPAIRS_HUB_URL

  const {
    timesheet: { hasOutOfHoursJobs, outOfHoursJobs, outOfHoursTotal },
  } = useContext(PageContext)

  return (
    <Table id="ooh-jobs" className="bc-ooh-jobs">
      <THead>
        <TR>
          <TH scope="col" colSpan="4">
            Out of hours – work orders
          </TH>
        </TR>
      </THead>
      {hasOutOfHoursJobs ? (
        <>
          <TBody>
            {outOfHoursJobs.map((payElement, index) => (
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
                  &pound;{numberWithPrecision(payElement.value, 2)}
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
                &pound;{numberWithPrecision(outOfHoursTotal, 2)}
              </TD>
            </TR>
          </TFoot>
        </>
      ) : (
        <TBody>
          <TR>
            <TD colSpan="4">
              There are no out of hours work orders for this week.
            </TD>
          </TR>
        </TBody>
      )}
    </Table>
  )
}

export default OutOfHoursJobs
