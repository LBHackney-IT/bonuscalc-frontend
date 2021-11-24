import PageContext from '@/components/PageContext'
import { Table, THead, TBody, TR, TH, TD } from '@/components/Table'
import { useContext } from 'react'
import { numberWithPrecision } from '@/utils/number'

const OutOfHoursRota = () => {
  const {
    timesheet: { week, hasOutOfHoursRota, outOfHoursRota },
  } = useContext(PageContext)

  return (
    <Table id="ooh-rota" className="bc-ooh-rota">
      <THead>
        <TR>
          <TH scope="col">Out of hours</TH>
          <TH scope="col" align="centre">
            Mon
          </TH>
          <TH scope="col" align="centre">
            Tue
          </TH>
          <TH scope="col" align="centre">
            Wed
          </TH>
          <TH scope="col" align="centre">
            Thu
          </TH>
          <TH scope="col" align="centre">
            Fri
          </TH>
          <TH scope="col" align="centre">
            Sat
          </TH>
          <TH scope="col" align="centre">
            Sun
          </TH>
          <TH scope="col" align="centre">
            Days
          </TH>
          <TH scope="col" align="right">
            Total
          </TH>
        </TR>
      </THead>
      {hasOutOfHoursRota ? (
        outOfHoursRota.map((payElement, index) => (
          <TBody key={index}>
            <TR>
              <TD>{week.dateRange}</TD>
              <TD align="centre">
                {payElement.monday > 0 &&
                  numberWithPrecision(payElement.monday, 0)}
              </TD>
              <TD align="centre">
                {payElement.tuesday > 0 &&
                  numberWithPrecision(payElement.tuesday, 0)}
              </TD>
              <TD align="centre">
                {payElement.wednesday > 0 &&
                  numberWithPrecision(payElement.wednesday, 0)}
              </TD>
              <TD align="centre">
                {payElement.thursday > 0 &&
                  numberWithPrecision(payElement.thursday, 0)}
              </TD>
              <TD align="centre">
                {payElement.friday > 0 &&
                  numberWithPrecision(payElement.friday, 0)}
              </TD>
              <TD align="centre">
                {payElement.saturday > 0 &&
                  numberWithPrecision(payElement.saturday, 0)}
              </TD>
              <TD align="centre">
                {payElement.sunday > 0 &&
                  numberWithPrecision(payElement.sunday, 0)}
              </TD>
              <TD align="centre">{numberWithPrecision(payElement.days, 0)}</TD>
              <TD numeric={true}>
                &pound;{numberWithPrecision(payElement.value, 2)}
              </TD>
            </TR>
            {payElement.comment && (
              <TR>
                <TD colSpan="8">{payElement.comment}</TD>
                <TD>&nbsp;</TD>
                <TD>&nbsp;</TD>
              </TR>
            )}
          </TBody>
        ))
      ) : (
        <TBody>
          <TR>
            <TD colSpan="10">
              There are no out of hours entries for this week.
            </TD>
          </TR>
        </TBody>
      )}
    </Table>
  )
}

export default OutOfHoursRota
