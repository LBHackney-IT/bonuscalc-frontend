import PageContext from '@/components/PageContext'
import { Table, THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { numberWithPrecision } from '@/utils/number'
import { smvhOrUnits, bandForValue } from '@/utils/scheme'
import { useContext } from 'react'

const WeeklySummaries = () => {
  const {
    operative: { scheme, isUnitScheme, salaryBand },
    summary: {
      hasWeeklySummaries,
      weeklySummaries,
      totalNonProductiveValue,
      totalNonProductiveDuration,
      totalProductiveValue,
      totalValueForBonusPeriod,
      projectedValue,
    },
  } = useContext(PageContext)

  return (
    <Table id="weekly-summary">
      <THead>
        <TR>
          <TH scope="col" colSpan="2" align="centre">
            Week
          </TH>
          <TH scope="col" align="centre">
            {isUnitScheme ? 'Units\u00A0(P)' : 'SMVh\u00A0(P)'}
          </TH>
          <TH scope="col" align="centre">
            {'Hours\u00A0(NP)'}
          </TH>
          <TH scope="col" align="centre">
            {isUnitScheme ? 'Units\u00A0(NP)' : 'SMVh\u00A0(NP)'}
          </TH>
          <TH scope="col" align="centre">
            {isUnitScheme ? 'Total\u00A0Units' : 'Total\u00A0SMVh'}
          </TH>
          <TH scope="col" align="centre" width="one-tenth">
            Band
          </TH>
          <TH scope="col" align="centre">
            Projected
          </TH>
        </TR>
      </THead>
      {hasWeeklySummaries ? (
        <>
          <TBody>
            {weeklySummaries.map((ws, index) => (
              <TR key={index}>
                <TD numeric={true}>{ws.number}</TD>
                <TD align="right">{ws.description}</TD>
                <TD numeric={true}>
                  {numberWithPrecision(
                    smvhOrUnits(scheme, ws.productiveValue),
                    scheme.precision
                  )}
                </TD>
                <TD numeric={true}>
                  {numberWithPrecision(ws.nonProductiveDuration, 2)}
                </TD>
                <TD numeric={true}>
                  {numberWithPrecision(
                    smvhOrUnits(scheme, ws.nonProductiveValue),
                    scheme.precision
                  )}
                </TD>
                <TD numeric={true}>
                  {numberWithPrecision(
                    smvhOrUnits(scheme, ws.totalValue),
                    scheme.precision
                  )}
                </TD>
                <TD align="centre">
                  {bandForValue(scheme.payBands, ws.totalValue)}
                </TD>
                <TD align="centre">
                  {bandForValue(scheme.payBands, ws.projectedValue)}
                </TD>
              </TR>
            ))}
          </TBody>
          <TFoot>
            <TR>
              <TH scope="row" colSpan="2" align="right">
                Totals
              </TH>
              <TD numeric={true}>
                {numberWithPrecision(
                  smvhOrUnits(scheme, totalProductiveValue),
                  scheme.precision
                )}
              </TD>
              <TD numeric={true}>
                {numberWithPrecision(totalNonProductiveDuration, 2)}
              </TD>
              <TD numeric={true}>
                {numberWithPrecision(
                  smvhOrUnits(scheme, totalNonProductiveValue),
                  scheme.precision
                )}
              </TD>
              <TD numeric={true}>
                {numberWithPrecision(
                  smvhOrUnits(scheme, totalValueForBonusPeriod),
                  scheme.precision
                )}
              </TD>
              <TD align="centre">{salaryBand}</TD>
              <TD align="centre">
                {bandForValue(scheme.payBands, projectedValue)}
              </TD>
            </TR>
          </TFoot>
        </>
      ) : (
        <TBody>
          <TR>
            <TD colSpan="8">There are no weekly summaries for this period.</TD>
          </TR>
        </TBody>
      )}
    </Table>
  )
}

export default WeeklySummaries
