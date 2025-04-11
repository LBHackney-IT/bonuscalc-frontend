import Link from 'next/link'
import PageContext from '@/components/PageContext'
import { Table, Caption } from '@/components/Table'
import { THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { useContext } from 'react'
import { numberWithPrecision } from '@/utils/number'

const OvertimeJobs = () => {
  const repairsHubUrl = process.env.NEXT_PUBLIC_REPAIRS_HUB_URL

  const {
    timesheet: {
      hasOvertimeHours,
      hasOvertimeJobs,
      overtimeJobs,
      overtimeTotal,
    },
  } = useContext(PageContext)

  return (
    <>
      {hasOvertimeJobs && (
        <Table id="overtime-jobs" className="bc-overtime-jobs">
          <Caption className="govuk-!-margin-bottom-2 lbh-heading-h4">
            Overtime – Work orders
          </Caption>
          <THead>
            <TR>
              <TH scope="col">Reference</TH>
              <TH scope="col">Address</TH>
              <TH scope="col">Description</TH>
              <TH scope="col" align="centre">
                Date
              </TH>
              <TH scope="col" numeric={true}>
                Value
              </TH>
            </TR>
          </THead>
          <TBody>
            {overtimeJobs.map((payElement, index) => (
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
                <TD align="centre">{payElement.closedDate}</TD>
                <TD numeric={true}>
                  &pound;{numberWithPrecision(payElement.value, 2)}
                </TD>
              </TR>
            ))}
          </TBody>
          {!hasOvertimeHours && (
            <TFoot>
              <TR>
                <TH scope="row" colSpan="4" align="right">
                  Total
                </TH>
                <TD numeric={true}>
                  &pound;{numberWithPrecision(overtimeTotal, 2)}
                </TD>
              </TR>
            </TFoot>
          )}
        </Table>
      )}
    </>
  );
}

export default OvertimeJobs
