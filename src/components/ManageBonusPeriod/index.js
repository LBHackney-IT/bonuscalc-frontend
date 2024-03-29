import cx from 'classnames'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import LinkButton from '@/components/LinkButton'
import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
import UserContext from '@/components/UserContext'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import { BonusPeriod } from '@/models'
import { useBandChangePeriod, useBandChanges, useWeek } from '@/utils/apiClient'

const WeekNotStarted = () => {
  return (
    <section className="bc-open-weeks__operatives">
      <header>
        <h4>Week not started</h4>
      </header>
    </section>
  )
}

const CurrentWeek = () => {
  return <p>Current week</p>
}

const ClosedTime = ({ week }) => {
  const { closedDate, closedAt } = week
  const dateTime = closedAt.toISOString()
  const title = closedAt.toLocaleString()

  return (
    <time dateTime={dateTime} title={title}>
      {closedDate}
    </time>
  )
}

const ClosedWeek = ({ week }) => {
  return (
    <p>
      <strong>Week closed&nbsp;</strong>
      <span>
        on&nbsp;
        <ClosedTime week={week} />
        &nbsp;
      </span>
      <span>by {week.closedByName}</span>
    </p>
  )
}

const CloseWeek = ({ week }) => {
  return (
    <Link href={`/manage/weeks/${week.id}/close`}>
      <a className="lbh-link lbh-link--no-visited-state">
        {week.isClosed ? (
          <>Send outstanding reports</>
        ) : (
          <>Close week and send reports</>
        )}
      </a>
    </Link>
  )
}

const OperativeListItem = ({ operative, week }) => {
  const baseUrl = `/operatives/${operative.id}/timesheets/${week.id}`
  const backUrl = encodeURIComponent('/manage/weeks')

  return (
    <li>
      <Link href={`${baseUrl}/productive?backUrl=${backUrl}`}>
        <a className="lbh-link lbh-link--no-visited-state">
          <span>{operative.description}&nbsp;–&nbsp;</span>
          <span>{operative.tradeDescription}</span>
        </a>
      </Link>
    </li>
  )
}

const OperativeList = ({ date }) => {
  const { user } = useContext(UserContext)
  const { week, isLoading, isError } = useWeek(date)
  const [operatives, setOperatives] = useState(null)
  const [allOperatives, setAllOperatives] = useState(null)
  const [showAllOperatives, setShowAllOperatives] = useState(false)

  const toggleShowAllOperatives = () => {
    setShowAllOperatives(!showAllOperatives)
  }

  useEffect(() => {
    if (week && !allOperatives) {
      setAllOperatives(week.operatives.filter((os) => os.hasZeroSMVs))
    }
  }, [isLoading, allOperatives, week])

  useEffect(() => {
    if (allOperatives) {
      if (showAllOperatives) {
        setOperatives(allOperatives)
      } else {
        setOperatives(allOperatives.slice(0, 5))
      }
    }
  }, [allOperatives, showAllOperatives])

  if (isLoading) return <Spinner />
  if (isError || !week)
    return (
      <p className="lbh-body-s govuk-!-margin-top-2">
        <ErrorMessage
          description={`Unable to fetch operative summaries for ${date}`}
        />
      </p>
    )

  return (
    allOperatives &&
    operatives && (
      <section className="bc-open-weeks__operatives">
        <header>
          <h4>Operatives with no SMVs ({allOperatives.length})</h4>
          <nav>
            <Link href={`/manage/weeks/${week.id}/operatives`}>
              <a className="lbh-link lbh-link--no-visited-state">
                View all operatives
              </a>
            </Link>
            {week.isClosed && user.hasWeekManagerPermissions && (
              <>
                <a
                  href={`/api/reports/overtime/${week.id}`}
                  className="lbh-link lbh-link--no-visited-state"
                >
                  Download Overtime CSV file
                </a>
                <a
                  href={`/api/reports/out-of-hours/${week.id}`}
                  className="lbh-link lbh-link--no-visited-state"
                >
                  Download Out of hours CSV file
                </a>
              </>
            )}
          </nav>
        </header>
        {week.isEditable && operatives.length > 0 && (
          <>
            <ol className="lbh-list">
              {operatives.map((operative, index) => (
                <OperativeListItem
                  operative={operative}
                  week={week}
                  key={index}
                />
              ))}
            </ol>
            {allOperatives.length > 5 && (
              <footer>
                <LinkButton onClick={toggleShowAllOperatives}>
                  {showAllOperatives ? <>Show fewer</> : <>Show all</>}
                </LinkButton>
              </footer>
            )}
          </>
        )}
      </section>
    )
  )
}

const ManageWeek = ({ week, showAll, firstOpenWeek }) => {
  const { user } = useContext(UserContext)
  const [isVisible, setIsVisible] = useState(week.isVisible)

  useEffect(() => {
    setIsVisible(week.isVisible || showAll)
  }, [week, showAll])

  return (
    isVisible && (
      <section
        className={cx('bc-open-weeks__week', {
          'bc-open-weeks__week--current': week.isCurrent,
          'bc-open-weeks__week--closed': week.isClosed,
        })}
      >
        <header>
          <h3>
            {week.description} <span>({week.dateRange})</span>
          </h3>
          {week.isCurrent && <CurrentWeek />}
          {week.isCompleted && <ClosedWeek week={week} />}
          {week.hasOutstandingReports && user.hasWeekManagerPermissions && (
            <CloseWeek week={week} />
          )}
          {week.id == firstOpenWeek?.id &&
            !week.isCurrent &&
            user.hasWeekManagerPermissions && <CloseWeek week={week} />}
        </header>
        {week.isFuture ? <WeekNotStarted /> : <OperativeList date={week.id} />}
      </section>
    )
  )
}

const ManageBonusPeriod = ({ period }) => {
  const [showAllWeeks, setShowAllWeeks] = useState(false)
  const router = useRouter()

  const {
    bonusPeriod: currentPeriod,
    isLoading: isPeriodLoading,
    isError: isPeriodError,
  } = useBandChangePeriod()

  const {
    bandChanges,
    isLoading: isBandChangesLoading,
    isError: isBandChangesError,
  } = useBandChanges()

  const toggleShowAllWeeks = () => {
    setShowAllWeeks(!showAllWeeks)
  }

  const firstOpenWeek = period.weeks.find((week) => week.isEditable)

  const isDisabled = () => {
    return (
      period.id != currentPeriod.id ||
      bandChanges.length == 0 ||
      bandChanges.some((bc) => bc.isPending)
    )
  }

  const onClick = () => {
    router.push('/manage/periods/close')
  }

  if (isPeriodLoading) return <Spinner />
  if (isPeriodError || !currentPeriod)
    return (
      <p className="lbh-body-s govuk-!-margin-top-2">
        <ErrorMessage
          description={`Unable to fetch the current bonus period`}
        />
      </p>
    )

  if (isBandChangesLoading) return <Spinner />
  if (isBandChangesError || !bandChanges)
    return (
      <p className="lbh-body-s govuk-!-margin-top-2">
        <ErrorMessage description={`Unable to fetch band changes`} />
      </p>
    )

  return (
    <section className="bc-open-weeks__period">
      <header>
        <h2>{period.description}</h2>
        <p>
          <LinkButton onClick={toggleShowAllWeeks}>
            {showAllWeeks ? (
              <>View current and open weeks</>
            ) : (
              <>View all weeks</>
            )}
          </LinkButton>
        </p>
      </header>

      {period.weeks.map((week, index) => (
        <ManageWeek
          week={week}
          key={index}
          showAll={showAllWeeks}
          firstOpenWeek={firstOpenWeek}
        />
      ))}

      {currentPeriod.id == period.id && (
        <ButtonGroup className="govuk-!-margin-top-0">
          <Button disabled={isDisabled()} onClick={onClick}>
            Close Period
          </Button>
        </ButtonGroup>
      )}
    </section>
  )
}

ManageBonusPeriod.propTypes = {
  period: PropTypes.instanceOf(BonusPeriod).isRequired,
  index: PropTypes.number.isRequired,
}

export default ManageBonusPeriod
