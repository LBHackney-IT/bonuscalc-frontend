import PageContext from '@/components/PageContext'
import { Table, Caption } from '@/components/Table'
import { THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { useContext } from 'react'
import { numberWithPrecision } from '@/utils/number'

const OvertimeHours = () => {
  const {
    timesheet: { week, hasOvertimeHours, sortedOvertimeHours, overtimeTotal },
  } = useContext(PageContext)

  return (
    <Table
      id="overtime-hours"
      className="bc-overtime-hours govuk-!-margin-top-9"
    >
      <Caption className="govuk-!-margin-bottom-2 lbh-heading-h4">
        Manually added Overtime
      </Caption>
      <THead>
        <TR>
          <TH scope="col">Day</TH>
          <TH scope="col">Address</TH>
          <TH scope="col" align="centre">
            Hours
          </TH>
          <TH scope="col" align="right">
            Value
          </TH>
        </TR>
      </THead>
      {hasOvertimeHours ? (
        sortedOvertimeHours.map((payElement, index) => (
          <TBody key={index}>
            <TR>
              <TD>{payElement.weekday(week.startAt)}</TD>
              <TD>{payElement.comment}</TD>
              <TD align="centre">
                {numberWithPrecision(payElement.duration, 2)}
              </TD>
              <TD numeric={true}>
                &pound;{numberWithPrecision(payElement.value, 2)}
              </TD>
            </TR>
          </TBody>
        ))
      ) : (
        <TBody>
          <TR>
            <TD colSpan="4">
              There is no manually added overtime for this week.
            </TD>
          </TR>
        </TBody>
      )}
      <TFoot>
        <TR>
          <TH scope="row" colSpan="3" align="right">
            Total
          </TH>
          <TD numeric={true}>&pound;{numberWithPrecision(overtimeTotal, 2)}</TD>
        </TR>
      </TFoot>
    </Table>
  )
}

export default OvertimeHours
