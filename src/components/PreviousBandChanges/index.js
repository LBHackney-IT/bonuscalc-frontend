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
import { useBandChanges } from '@/utils/apiClient'
import { numberWithPrecision } from '@/utils/number'
import { smvh } from '@/utils/scheme'
import { compareStrings } from '@/utils/string'
import { escapeRegExp, transliterate } from '@/utils/string'

const Header = ({ period }) => {
  return (
    <h1 className="bc-band-changes__header">
      <span>Band change</span>
      <span>({period.description})</span>
    </h1>
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
    <>
      <Table className="bc-band-changes__list">
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
              <button {...buttonProps('sickDuration')}>{'Sick'}</button>
            </TH>
            <TH scope="col" numeric={true}>
              <button {...buttonProps('totalValue')}>{'Total'}</button>
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
            <TH scope="col" align="centre">
              <button {...buttonProps('finalBand')}>{'Change'}</button>
            </TH>
          </TR>
        </THead>
        {operatives.length > 0 ? (
          operatives.map((o, index) => (
            <TBody
              key={index}
              className={cx('bc-band-changes__row', {
                'bc-band-changes__row--approved': o.isApproved,
                'bc-band-changes__row--rejected': o.isRejected,
                'bc-band-changes__row--manager-decision': o.hasManagerDecision,
                'bc-band-changes__row--supervisor-decision':
                  o.isSupervisorRejected,
              })}
            >
              <TR>
                <TD>
                  <Link
                    href={`${baseUrl}/${o.operativeId}/summaries/${period.id}`}
                  >
                    {o.operativeName}
                  </Link>
                </TD>
                <TD align="centre">
                  <Link
                    href={`${baseUrl}/${o.operativeId}/summaries/${period.id}`}
                  >
                    {o.operativeId}
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
                <TD align="centre">{o.changedBand}</TD>
              </TR>
              {o.isSupervisorRejected && (
                <TR className="bc-band-changes__supervisor">
                  <TD colSpan="6">
                    <h3>
                      Rejected on {o.supervisorDate} by {o.supervisorName},
                      changed to: {o.supervisorBand}
                    </h3>
                    <p>
                      <strong>Reason for rejection:</strong>{' '}
                      {o.supervisorReason}
                    </p>
                  </TD>
                  <TD>&nbsp;</TD>
                </TR>
              )}
              {o.hasManagerDecision && (
                <TR className="bc-band-changes__manager">
                  <TD colSpan="6">
                    {o.isManagerApproved ? (
                      <h3>
                        Approved on {o.managerDate} by {o.managerName}
                      </h3>
                    ) : (
                      <h3>
                        Rejected on {o.managerDate} by {o.managerName}, changed
                        to: {o.managerBand}
                      </h3>
                    )}
                    <p>
                      <strong>Reason for operative:</strong> {o.managerReason}
                    </p>
                  </TD>
                  <TD>&nbsp;</TD>
                </TR>
              )}
            </TBody>
          ))
        ) : (
          <TBody>
            <TR>
              <TD colSpan="8">No operatives match your search</TD>
            </TR>
          </TBody>
        )}
      </Table>
    </>
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
    filterOperatives(searchInput.current.value)
  }, [allOperatives, filterOperatives])

  return (
    <>
      <div className="bc-band-changes__search">
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
        <section
          className="govuk-tabs__panel bc-band-changes--historical"
          id="bonus-band"
        >
          <OperativeList
            period={period}
            operatives={operatives.filter((o) => o.isBonusBand)}
          />
        </section>
        <section
          className="govuk-tabs__panel bc-band-changes--historical govuk-tabs__panel--hidden"
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

const PreviousBandChanges = ({ period }) => {
  const { bandChanges, isLoading, isError } = useBandChanges(period.id)
  const { user } = useContext(UserContext)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('lbh-frontend').initAll()
    }
  }, [bandChanges])

  if (isLoading) return <Spinner />
  if (isError || !bandChanges)
    return (
      <NotFound>
        Couldn’t find band changes for the current bonus period.
      </NotFound>
    )

  const myBandChanges = bandChanges.filter(
    (bc) => bc.supervisorEmail == user.email
  )

  return (
    <section className="bc-band-changes bc-band-changes--historical">
      <Header period={period} />
      <Search
        allOperatives={showAll ? bandChanges : myBandChanges}
        period={period}
        showAll={showAll}
        setShowAll={setShowAll}
      />
    </section>
  )
}

PreviousBandChanges.propTypes = {
  period: PropTypes.instanceOf(BonusPeriod).isRequired,
}

export default PreviousBandChanges
