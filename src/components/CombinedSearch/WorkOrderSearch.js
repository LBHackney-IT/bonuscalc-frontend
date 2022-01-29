import Link from 'next/link'
import Button from '@/components/Button'
import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
import { useState, useRef } from 'react'
import { Table, THead, TBody, TR, TH, TD } from '@/components/Table'
import { findWorkElements } from '@/utils/apiClient'
import { numberWithPrecision } from '@/utils/number'
import { smvh } from '@/utils/scheme'

const WorkOrderSearch = () => {
  const repairsHubUrl = process.env.NEXT_PUBLIC_REPAIRS_HUB_URL
  const invalidWorkOrder = /^(?:\d{1,7}|\d{9,})$/
  const workOrderSearch = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [workElements, setWorkElements] = useState(null)

  const handleSearch = async () => {
    event.preventDefault()

    const query = workOrderSearch.current.value

    setError(null)
    setLoading(false)
    setWorkElements(null)

    if (!query) {
      setError('Enter a work order reference or address')
    } else if (invalidWorkOrder.test(query)) {
      setError('Work order reference must be 8 digits (e.g. 12345678)')
    } else {
      setLoading(true)

      const results = await findWorkElements(query)

      setLoading(false)

      if (results) {
        setWorkElements(results)
      } else {
        setWorkElements(null)
        setError('Sorry, an unexpected error occurred')
      }
    }
  }

  return (
    <form onSubmit={handleSearch}>
      <div className="govuk-form-group lbh-form-group">
        <label className="govuk-label lbh-label" htmlFor="workOrderSearch">
          Search by work order reference or address
        </label>
        <input
          className="govuk-input lbh-input govuk-input--width-20"
          id="workOrderSearch"
          name="workOrderSearch"
          type="text"
          maxLength="30"
          ref={workOrderSearch}
        />
      </div>

      <Button type="submit" disabled={loading}>
        Search
      </Button>

      <div className="govuk-form-group lbh-form-group govuk-!-margin-top-6">
        {error && <ErrorMessage description={error} />}
        {loading && <Spinner />}
        {workElements && (
          <>
            {workElements.length == 0 ? (
              <p className="lbh-body-m govuk-!-margin-top-8">
                No work orders matched your query
              </p>
            ) : (
              <Table className="bc-search bc-search__work-elements govuk-!-margin-top-8">
                <caption className="govuk-!-text-align-left govuk-!-margin-bottom-2">
                  {workElements.length == 1 ? (
                    <>
                      We found 1 matching result for:{' '}
                      {workOrderSearch.current.value}
                    </>
                  ) : (
                    <>
                      We found {workElements.length} matching results for:{' '}
                      {workOrderSearch.current.value}
                    </>
                  )}
                </caption>
                <THead>
                  <TR>
                    <TH scope="col">Operative name</TH>
                    <TH scope="col" align="centre">
                      Payroll no.
                    </TH>
                    <TH scope="col" align="centre">
                      Reference
                    </TH>
                    <TH scope="col">Property</TH>
                    <TH scope="col" align="centre">
                      Close date
                    </TH>
                    <TH scope="col" numeric={true}>
                      SMVh
                    </TH>
                    <TH scope="col" align="centre">
                      Period
                    </TH>
                    <TH scope="col" align="centre">
                      Week
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {workElements.map((workElement, index) => (
                    <TR key={index}>
                      <TD>
                        <Link href={`/operatives/${workElement.operativeId}`}>
                          <a className="lbh-link lbh-link--no-visited-state">
                            {workElement.operativeName}
                          </a>
                        </Link>
                      </TD>
                      <TD align="centre">
                        <Link href={`/operatives/${workElement.operativeId}`}>
                          <a className="lbh-link lbh-link--no-visited-state">
                            {workElement.operativeId}
                          </a>
                        </Link>
                      </TD>
                      <TD align="centre">
                        <Link
                          href={`${repairsHubUrl}/${workElement.workOrder}`}
                        >
                          <a
                            className="lbh-link lbh-link--no-visited-state"
                            target="_blank"
                          >
                            {workElement.workOrder}
                          </a>
                        </Link>
                      </TD>
                      <TD>{workElement.address}</TD>
                      <TD align="centre">{workElement.closedDate}</TD>
                      <TD numeric={true}>
                        {numberWithPrecision(smvh(workElement.value), 2)}
                      </TD>
                      <TD align="centre">
                        <Link href={workElement.summaryUrl}>
                          <a className="lbh-link lbh-link--no-visited-state">
                            {workElement.week.bonusPeriod.number}
                          </a>
                        </Link>
                      </TD>
                      <TD align="centre">
                        <Link href={workElement.timesheetUrl}>
                          <a className="lbh-link lbh-link--no-visited-state">
                            {workElement.week.number}
                          </a>
                        </Link>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </>
        )}
      </div>
    </form>
  )
}

export default WorkOrderSearch
