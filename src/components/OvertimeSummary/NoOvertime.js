import { Table, Caption, THead, TBody, TR, TH, TD } from '@/components/Table'

const NoOvertime = () => {
  return (
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
        <TR>
          <TD colSpan="5">There is no overtime for this week.</TD>
        </TR>
      </TBody>
    </Table>
  )
}

export default NoOvertime
