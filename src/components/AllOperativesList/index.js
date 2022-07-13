import cx from 'classnames'
import PropTypes from 'prop-types'
import Link from 'next/link'
import ButtonGroup from '@/components/ButtonGroup'
import ButtonLink from '@/components/ButtonLink'
import { useState, useRef } from 'react'
import { SearchIcon, CrossIcon } from '@/components/Icons'
import { Table, THead, TBody, TR, TH, TD } from '@/components/Table'
import { BonusPeriod, Scheme, Week } from '@/models'
import { numberWithPrecision } from '@/utils/number'
import { smvh } from '@/utils/scheme'
import { compareStrings } from '@/utils/string'
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
  const allOperatives = week.operatives
  const searchInput = useRef(null)

  const [value, setValue] = useState('')
  const [operatives, setOperatives] = useState(week.operatives)

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

  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('ASC')

  const sortOn = (property) => {
    return () => {
      if (sortBy == property) {
        if (sortOrder == 'ASC') {
          setSortOrder('DESC')
        } else {
          setSortOrder('ASC')
        }
      } else {
        setSortBy(property)
      }
    }
  }

  const sortClass = (property) => {
    return cx(
      sortBy == property ? 'bc-sort' : null,
      sortBy == property && sortOrder == 'DESC' ? 'bc-sort-desc' : null
    )
  }

  const buttonProps = (property) => {
    return {
      onClick: sortOn(property),
      className: sortClass(property),
    }
  }

  if (sortOrder == 'ASC') {
    operatives.sort((a, b) => {
      return compareStrings(a[sortBy], b[sortBy])
    })
  } else {
    operatives.sort((a, b) => {
      return compareStrings(b[sortBy], a[sortBy])
    })
  }

  return (
    <Table className="bc-all-operatives__list">
      <THead>
        <TR>
          <TH scope="col">
            <button {...buttonProps('name')}>{'Operative\u00A0name'}</button>
          </TH>
          <TH scope="col" align="centre">
            <button {...buttonProps('id')}>{'Payroll\u00A0no.'}</button>
          </TH>
          <TH scope="col" align="centre">
            <button {...buttonProps('tradeCode')}>Trade</button>
          </TH>
          <TH scope="col" numeric={true}>
            <button {...buttonProps('productiveValue')}>
              {'SMVh\u00A0(P)'}
            </button>
          </TH>
          <TH scope="col" numeric={true}>
            <button {...buttonProps('nonProductiveDuration')}>
              {'Hours\u00A0(NP)'}
            </button>
          </TH>
          <TH scope="col" numeric={true}>
            <button {...buttonProps('nonProductiveValue')}>
              {'SMVh\u00A0(NP)'}
            </button>
          </TH>
          <TH scope="col" numeric={true}>
            <button {...buttonProps('totalValue')}>{'Total\u00A0SMVh'}</button>
          </TH>
          <TH scope="col" align="centre">
            <div className="bc-summary-payband">
              <button {...buttonProps('payBand')}>Band</button>
              <span> </span>
              <button {...buttonProps('projectedPayBand')}>Projected</button>
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
                  <span>{o.payBand}</span>
                  <span> </span>
                  <span>{o.projectedPayBand}</span>
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
  week.operatives.forEach((o) => {
    o.scheme = schemes[o.schemeId]
  })

  const firstOpenWeek = period.weeks.find((week) => week.isEditable)
  const showCloseWeek = week.id == firstOpenWeek?.id
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
