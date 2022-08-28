import cx from 'classnames'
import PropTypes from 'prop-types'
import Link from 'next/link'
import LinkButton from '@/components/LinkButton'
import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import UserContext from '@/components/UserContext'
import { useContext, useState, useRef } from 'react'
import { useEffect, useCallback } from 'react'
import { SearchIcon, CrossIcon } from '@/components/Icons'
import { Table, THead, TBody, TR, TH, TD } from '@/components/Table'
import { BonusPeriod } from '@/models'
import { useOperativeProjections } from '@/utils/apiClient'
import { numberWithPrecision } from '@/utils/number'
import { smvh } from '@/utils/scheme'
import { compareStrings } from '@/utils/string'
import { escapeRegExp, transliterate } from '@/utils/string'

const Header = ({ period }) => {
  return (
    <h1 className="bc-projections__header">
      <span>Band change</span>
      <span>({period.description})</span>
    </h1>
  )
}

const InformationPanel = () => {
  return (
    <section className="lbh-page-announcement lbh-page-announcement--info">
      <h3 className="lbh-page-announcement__title govuk-!-font-size-19">
        Band changes cannot be approved or rejected
      </h3>
      <div className="lbh-page-announcement__content govuk-!-font-size-16">
        One or more weeks of the current period is still open.
      </div>
    </section>
  )
}

const OperativeList = ({ operatives, period }) => {
  const baseUrl = `/operatives`
  const [sortBy, setSortBy] = useState('operativeId')
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
    <Table className="bc-projections__list">
      <THead>
        <TR>
          <TH scope="col">
            <button {...buttonProps('operativeName')}>{'Operative'}</button>
          </TH>
          <TH scope="col" align="centre">
            <button {...buttonProps('operativeId')}>
              {'Payroll\u00A0no.'}
            </button>
          </TH>
          <TH scope="col" align="centre">
            <button {...buttonProps('trade')}>Trade</button>
          </TH>
          <TH scope="col" numeric={true}>
            <button {...buttonProps('sickDuration')}>
              {'Sick\u00A0hours'}
            </button>
          </TH>
          <TH scope="col" numeric={true}>
            <button {...buttonProps('totalValue')}>{'Total\u00A0SMVh'}</button>
          </TH>
          <TH scope="col" align="centre">
            <div className="bc-summary-payband">
              <button {...buttonProps('salaryBand')}>Band</button>
              <span> </span>
              <button {...buttonProps('projectedBand')}>
                <abbr title="Projected">Proj.</abbr>
              </button>
            </div>
          </TH>
        </TR>
      </THead>
      <TBody>
        {operatives.length > 0 ? (
          operatives.map((o, index) => (
            <TR key={index}>
              <TD>
                <Link
                  href={`${baseUrl}/${o.operativeId}/summaries/${period.id}`}
                >
                  <a>{o.operativeName}</a>
                </Link>
              </TD>
              <TD align="centre">
                <Link
                  href={`${baseUrl}/${o.operativeId}/summaries/${period.id}`}
                >
                  <a>{o.operativeId}</a>
                </Link>
              </TD>
              <TD align="centre">
                <abbr title={o.tradeDescription}>{o.tradeCode}</abbr>
              </TD>
              <TD numeric={true}>
                <span className={cx({ 'sick-warning': o.isSickWarning })}>
                  {numberWithPrecision(o.sickDuration, 2)}
                </span>
              </TD>
              <TD numeric={true}>
                {numberWithPrecision(smvh(o.totalValue), 2)}
              </TD>
              <TD align="centre">
                <div className="bc-summary-payband">
                  <span>{o.salaryBand}</span>
                  <span> </span>
                  <span className={cx({ 'sick-warning': o.isSickWarning })}>
                    {o.projectedBand}
                  </span>
                </div>
              </TD>
            </TR>
          ))
        ) : (
          <TR>
            <TD colSpan="6">No operatives match your search</TD>
          </TR>
        )}
      </TBody>
    </Table>
  )
}

const Search = ({ allOperatives, period, showAll, setShowAll }) => {
  const searchInput = useRef(null)

  const [value, setValue] = useState('')
  const [operatives, setOperatives] = useState(allOperatives)

  const filterOperatives = useCallback(
    (filter) => {
      if (filter) {
        const regex = new RegExp(escapeRegExp(transliterate(filter)), 'i')
        setOperatives(allOperatives.filter((o) => o.matches(regex)))
      } else {
        setOperatives(allOperatives)
      }
    },
    [allOperatives]
  )

  const onChange = (event) => {
    setValue(event.target.value)
    filterOperatives(event.target.value)
  }

  const onClick = () => {
    setValue('')
    filterOperatives('')
    searchInput.current.focus()
  }

  useEffect(() => {
    filterOperatives(value)
  }, [allOperatives, filterOperatives, value])

  return (
    <>
      <div className="bc-projections__search">
        <div>
          <h2>{showAll ? <>All operatives</> : <>My operatives</>}</h2>
          <p>
            <LinkButton
              className={'govuk-!-font-size-14'}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? <>Show my operatives</> : <>Show all operatives</>}
            </LinkButton>
          </p>
        </div>
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

      <div
        className="govuk-tabs lbh-tabs govuk-!-margin-top-6"
        data-module="govuk-tabs"
      >
        <ul className="govuk-tabs__list">
          <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
            <a className="govuk-tabs__tab" href="#bonus-band">
              Bonus band ({operatives.filter((o) => o.isBonusBand).length})
            </a>
          </li>
          <li className="govuk-tabs__list-item">
            <a className="govuk-tabs__tab" href="#fixed-band">
              Fixed band ({operatives.filter((o) => o.isFixedBand).length})
            </a>
          </li>
        </ul>
        <section className="govuk-tabs__panel" id="bonus-band">
          <OperativeList
            period={period}
            operatives={operatives.filter((o) => o.isBonusBand)}
          />
        </section>
        <section
          className="govuk-tabs__panel govuk-tabs__panel--hidden"
          id="fixed-band"
        >
          <OperativeList
            period={period}
            operatives={operatives.filter((o) => o.isFixedBand)}
          />
        </section>
      </div>
    </>
  )
}

const OperativeProjections = ({ period }) => {
  const { operativeProjections, isLoading, isError } = useOperativeProjections()
  const { user } = useContext(UserContext)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('lbh-frontend').initAll()
    }
  }, [operativeProjections])

  if (isLoading) return <Spinner />
  if (isError || !operativeProjections)
    return (
      <NotFound>
        Couldn’t find operative projections for the current bonus period.
      </NotFound>
    )

  const myOperativeProjections = operativeProjections.filter(
    (op) => op.supervisorEmailAddress == user.email
  )

  return (
    <section className="bc-projections">
      <Header period={period} />
      <InformationPanel />
      <Search
        allOperatives={showAll ? operativeProjections : myOperativeProjections}
        period={period}
        showAll={showAll}
        setShowAll={setShowAll}
      />
    </section>
  )
}

OperativeProjections.propTypes = {
  period: PropTypes.instanceOf(BonusPeriod).isRequired,
}

export default OperativeProjections
