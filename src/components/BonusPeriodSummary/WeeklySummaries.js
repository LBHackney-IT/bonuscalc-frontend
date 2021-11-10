import Link from 'next/link'
import PageContext from '@/components/PageContext'
import { Table, THead, TBody, TFoot, TR, TH, TD } from '@/components/Table'
import { numberWithPrecision } from '@/utils/number'
import { smvhOrUnits, bandForValue } from '@/utils/scheme'
import { useContext } from 'react'

const WeeklySummaries = () => {
  const {
    operative: { id, scheme, isUnitScheme, salaryBand },
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

  const baseUrl = `/operatives/${id}/timesheets`

  return (
    <Table id="weekly-summary" className="govuk-!-margin-top-3">
      <THead>
        <TR>
          <TH scope="col" align="centre">
            Week
          </TH>
          <TH scope="col" numeric={true}>
            {isUnitScheme ? 'Units\u00A0(P)' : 'SMVh\u00A0(P)'}
          </TH>
          <TH scope="col" numeric={true}>
            {'Hours\u00A0(NP)'}
          </TH>
          <TH scope="col" numeric={true}>
            {isUnitScheme ? 'Units\u00A0(NP)' : 'SMVh\u00A0(NP)'}
          </TH>
          <TH scope="col" numeric={true}>
            {isUnitScheme ? 'Total\u00A0Units' : 'Total\u00A0SMVh'}
          </TH>
          <TH scope="col" align="centre" width="two-tenths">
            <div className="bc-summary-payband">
              <span>Band</span>
              <span> </span>
              <span>Projected</span>
            </div>
          </TH>
        </TR>
      </THead>
      {hasWeeklySummaries ? (
        <>
          <TBody>
            {weeklySummaries.map((ws, index) => (
              <TR key={index}>
                <TD align="centre">
                  <div className="bc-summary-week">
                    <span>{ws.number}</span>
                    <span> </span>
                    <span>{ws.description}</span>
                  </div>
                </TD>
                <TD numeric={true}>
                  <Link href={`${baseUrl}/${ws.weekId}/productive`}>
                    <a className="lbh-link lbh-link--no-visited-state">
                      {numberWithPrecision(
                        smvhOrUnits(scheme, ws.productiveValue),
                        scheme.precision
                      )}
                    </a>
                  </Link>
                </TD>
                <TD numeric={true}>
                  <Link href={`${baseUrl}/${ws.weekId}/non-productive`}>
                    <a className="lbh-link lbh-link--no-visited-state">
                      {numberWithPrecision(ws.nonProductiveDuration, 2)}
                    </a>
                  </Link>
                </TD>
                <TD numeric={true}>
                  <Link href={`${baseUrl}/${ws.weekId}/non-productive`}>
                    <a className="lbh-link lbh-link--no-visited-state">
                      {numberWithPrecision(
                        smvhOrUnits(scheme, ws.nonProductiveValue),
                        scheme.precision
                      )}
                    </a>
                  </Link>
                </TD>
                <TD numeric={true}>
                  {numberWithPrecision(
                    smvhOrUnits(scheme, ws.totalValue),
                    scheme.precision
                  )}
                </TD>
                <TD align="centre">
                  <div className="bc-summary-payband">
                    <span>{bandForValue(scheme.payBands, ws.totalValue)}</span>
                    <span> </span>
                    <span>
                      {bandForValue(scheme.payBands, ws.projectedValue)}
                    </span>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
          <TFoot>
            <TR>
              <TH scope="row" align="right">
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
              <TD align="centre">
                <div className="bc-summary-payband">
                  <span>{salaryBand}</span>
                  <span>&rarr;</span>
                  <span>{bandForValue(scheme.payBands, projectedValue)}</span>
                </div>
              </TD>
            </TR>
          </TFoot>
        </>
      ) : (
        <TBody>
          <TR>
            <TD colSpan="6">There are no weekly summaries for this period.</TD>
          </TR>
        </TBody>
      )}
    </Table>
  )
}

export default WeeklySummaries
