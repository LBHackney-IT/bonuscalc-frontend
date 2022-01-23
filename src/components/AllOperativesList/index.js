import PropTypes from 'prop-types'
import Link from 'next/link'
import ButtonGroup from '@/components/ButtonGroup'
import ButtonLink from '@/components/ButtonLink'
import { useState, useRef } from 'react'
import { SearchIcon, CrossIcon } from '@/components/Icons'
import { Table, THead, TBody, TR, TH, TD } from '@/components/Table'
import { BonusPeriod, Scheme, Week } from '@/models'
import { numberWithPrecision } from '@/utils/number'
import { smvh, bandForValue } from '@/utils/scheme'
import { escapeRegExp, transliterate } from '@/utils/string'

const Header = ({ week }) => {
  return (
    <h1 className="bc-all-operatives__header">
      <span>{week.description}</span>
      <span>({week.dateRange})</span>
    </h1>
  )
}

const Search = ({ week }) => {
  const allOperatives = week.operativeSummaries
  const searchInput = useRef(null)

  const [value, setValue] = useState('')
  const [operatives, setOperatives] = useState(week.operativeSummaries)

  const filterOperatives = (filter) => {
    if (filter) {
      const regex = new RegExp(escapeRegExp(transliterate(filter)), 'i')
      setOperatives(allOperatives.filter((o) => o.matches(regex)))
    } else {
      setOperatives(allOperatives)
    }
  }

  const onChange = (event) => {
    setValue(event.target.value)
    filterOperatives(event.target.value)
  }

  const onClick = () => {
    setValue('')
    filterOperatives('')
    searchInput.current.focus()
  }

  return (
    <>
      <div className="bc-all-operatives__search">
        <p>All operatives</p>
        <p className="lbh-search-box">
          <label htmlFor="search">Search</label>
          <input
            ref={searchInput}
            id="search"
            type="search"
            placeholder="Search..."
            value={value}
            onChange={onChange}
          />
          <button onClick={onClick}>
            <span>Clear search</span>
            <SearchIcon />
            <CrossIcon />
          </button>
        </p>
      </div>
      <Operatives week={week.id} operatives={operatives} />
    </>
  )
}

const Operatives = ({ week, operatives }) => {
  const baseUrl = `/operatives`
  const backUrl = encodeURIComponent(`/manage/weeks/${week}/operatives`)
  const productiveUrl = `timesheets/${week}/productive?backUrl=${backUrl}`
  const nonProductiveUrl = `timesheets/${week}/non-productive?backUrl=${backUrl}`

  return (
    <Table className="bc-all-operatives__list">
      <THead>
        <TR>
          <TH scope="col">{'Operative\u00A0name'}</TH>
          <TH scope="col" align="centre">
            {'Payroll\u00A0no.'}
          </TH>
          <TH scope="col" align="centre">
            Trade
          </TH>
          <TH scope="col" numeric={true}>
            {'SMVh\u00A0(P)'}
          </TH>
          <TH scope="col" numeric={true}>
            {'Hours\u00A0(NP)'}
          </TH>
          <TH scope="col" numeric={true}>
            {'SMVh\u00A0(NP)'}
          </TH>
          <TH scope="col" numeric={true}>
            {'Total\u00A0SMVh'}
          </TH>
          <TH scope="col" align="centre">
            <div className="bc-summary-payband">
              <span>Band</span>
              <span> </span>
              <span>Projected</span>
            </div>
          </TH>
        </TR>
      </THead>
      <TBody>
        {operatives.length > 0 ? (
          operatives.map((o, index) => (
            <TR key={index}>
              <TD>
                <Link href={`${baseUrl}/${o.id}/${productiveUrl}`}>
                  <a>{o.name}</a>
                </Link>
              </TD>
              <TD align="centre">
                <Link href={`${baseUrl}/${o.id}/${productiveUrl}`}>
                  <a>{o.id}</a>
                </Link>
              </TD>
              <TD align="centre">
                <abbr title={o.trade.description}>{o.trade.id}</abbr>
              </TD>
              <TD numeric={true}>
                <Link href={`${baseUrl}/${o.id}/${productiveUrl}`}>
                  <a>{numberWithPrecision(smvh(o.productiveValue), 2)}</a>
                </Link>
              </TD>
              <TD numeric={true}>
                <Link href={`${baseUrl}/${o.id}/${nonProductiveUrl}`}>
                  <a>{numberWithPrecision(o.nonProductiveDuration, 2)}</a>
                </Link>
              </TD>
              <TD numeric={true}>
                <Link href={`${baseUrl}/${o.id}/${nonProductiveUrl}`}>
                  <a>{numberWithPrecision(o.nonProductiveDuration, 2)}</a>
                </Link>
              </TD>
              <TD numeric={true}>
                {numberWithPrecision(smvh(o.totalValue), 2)}
              </TD>
              <TD align="centre">
                <div className="bc-summary-payband">
                  <span>
                    {bandForValue(
                      o.scheme.payBands,
                      o.totalValue,
                      o.utilisation
                    )}
                  </span>
                  <span> </span>
                  <span>
                    {bandForValue(
                      o.scheme.payBands,
                      o.projectedValue,
                      o.averageUtilisation
                    )}
                  </span>
                </div>
              </TD>
            </TR>
          ))
        ) : (
          <TR>
            <TD colSpan="8">No operatives match your search</TD>
          </TR>
        )}
      </TBody>
    </Table>
  )
}

const AllOperativesList = ({ period, week, schemes }) => {
  week.operativeSummaries.forEach((os) => {
    os.scheme = schemes[os.schemeId]
  })

  const firstOpenWeek = period.weeks.find((week) => week.isEditable)
  const showCloseWeek = week.id == firstOpenWeek.id
  const baseUrl = `/manage/weeks/${week.id}/close`
  const backUrl = encodeURIComponent(`/manage/weeks/${week.id}/operatives`)

  return (
    <section className="bc-all-operatives">
      <Header week={week} />
      <Search week={week} />

      {showCloseWeek && (
        <ButtonGroup>
          <ButtonLink href={`${baseUrl}?backUrl=${backUrl}`}>
            Close week
          </ButtonLink>
        </ButtonGroup>
      )}
    </section>
  )
}

AllOperativesList.propTypes = {
  period: PropTypes.instanceOf(BonusPeriod),
  week: PropTypes.instanceOf(Week).isRequired,
  schemes: PropTypes.objectOf(PropTypes.instanceOf(Scheme)).isRequired,
}

export default AllOperativesList
