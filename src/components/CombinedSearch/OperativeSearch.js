import Link from 'next/link'
import Button from '@/components/Button'
import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
import { useState, useRef } from 'react'
import { Table, THead, TBody, TR, TH, TD } from '@/components/Table'
import { findOperatives } from '@/utils/apiClient'

const OperativeSearch = () => {
  const invalidPayrollNumber = /^(?:\d{1,5}|\d{7,})$/
  const operativeSearch = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [operatives, setOperatives] = useState(null)

  const handleSearch = async (event) => {
    event.preventDefault()

    const query = operativeSearch.current.value

    setError(null)
    setLoading(false)
    setOperatives(null)

    if (!query) {
      setError('Enter a payroll number or operative name')
    } else if (invalidPayrollNumber.test(query)) {
      setError('Payroll number must be 6 digits (e.g. 123456)')
    } else {
      setLoading(true)

      const results = await findOperatives(query)

      setLoading(false)

      if (results) {
        setOperatives(results)
      } else {
        setOperatives(null)
        setError('Sorry, an unexpected error occurred')
      }
    }
  }

  return (
    <form onSubmit={handleSearch}>
      <div className="govuk-form-group lbh-form-group">
        <label className="govuk-label lbh-label" htmlFor="operativeSearch">
          Search by payroll number, operative name or trade code
        </label>
        <input
          className="govuk-input lbh-input govuk-input--width-20"
          id="operativeSearch"
          name="operativeSearch"
          type="text"
          maxLength="30"
          ref={operativeSearch}
        />
      </div>
      <Button type="submit" disabled={loading}>
        Search
      </Button>
      <div className="govuk-form-group lbh-form-group govuk-!-margin-top-6">
        {error && <ErrorMessage description={error} />}
        {loading && <Spinner />}
        {operatives && (
          <>
            {operatives.length == 0 ? (
              <p className="lbh-body-m govuk-!-margin-top-6 govuk-!-margin-top-8">
                No operatives matched your query
              </p>
            ) : (
              <Table className="bc-search bc-search__operatives govuk-!-margin-top-8">
                <caption className="govuk-!-text-align-left govuk-!-margin-bottom-2">
                  {operatives.length == 1 ? (
                    <>
                      We found 1 matching result for:{' '}
                      {operativeSearch.current.value}
                    </>
                  ) : (
                    <>
                      We found {operatives.length} matching results for:{' '}
                      {operativeSearch.current.value}
                    </>
                  )}
                </caption>
                <THead>
                  <TR>
                    <TH scope="col">Operative name</TH>
                    <TH scope="col" align="centre">
                      Payroll no.
                    </TH>
                    <TH scope="col">Trade</TH>
                    <TH scope="col" align="centre">
                      Section / Team
                    </TH>
                    <TH scope="col">Scheme</TH>
                    <TH scope="col" align="centre">
                      Salary Band
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {operatives.map((operative, index) => (
                    <TR key={index}>
                      <TD>
                        <Link
                          href={`/operatives/${operative.id}`}
                          className="lbh-link lbh-link--no-visited-state">

                          {operative.name}

                        </Link>
                      </TD>
                      <TD align="centre">
                        <Link
                          href={`/operatives/${operative.id}`}
                          className="lbh-link lbh-link--no-visited-state">

                          {operative.id}

                        </Link>
                      </TD>
                      <TD>{operative.tradeDescription}</TD>
                      <TD align="centre">{operative.section}</TD>
                      <TD>{operative.schemeDescription}</TD>
                      <TD align="centre">{operative.salaryBand}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </>
        )}
      </div>
    </form>
  );
}

export default OperativeSearch
