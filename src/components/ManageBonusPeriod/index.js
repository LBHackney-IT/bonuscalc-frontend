import cx from 'classnames'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import LinkButton from '@/components/LinkButton'
import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
import UserContext from '@/components/UserContext'
import { useState, useEffect, useContext } from 'react'
import { BonusPeriod } from '@/models'
import { useWeek } from '@/utils/apiClient'

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
      <span>by {week.closedBy}</span>
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
  const { week, isLoading, isError } = useWeek(date)
  const [operatives, setOperatives] = useState(null)
  const [allOperatives, setAllOperatives] = useState(null)
  const [showAllOperatives, setShowAllOperatives] = useState(false)

  const toggleShowAllOperatives = () => {
    setShowAllOperatives(!showAllOperatives)
  }

  useEffect(() => {
    if (week && !allOperatives) {
      setAllOperatives(
        week.operativeSummaries.filter((os) => os.totalValue == 0)
      )
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
          <Link href={`/manage/weeks/${week.id}/operatives`}>
            <a className="lbh-link lbh-link--no-visited-state">
              View all operatives
            </a>
          </Link>
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
            <footer>
              <LinkButton onClick={toggleShowAllOperatives}>
                {showAllOperatives ? <>Show fewer</> : <>Show all</>}
              </LinkButton>
            </footer>
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

  const toggleShowAllWeeks = () => {
    setShowAllWeeks(!showAllWeeks)
  }

  const firstOpenWeek = period.weeks.find((week) => week.isEditable)

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

      <ButtonGroup>
        <Button disabled={true}>Close Period</Button>
      </ButtonGroup>
    </section>
  )
}

ManageBonusPeriod.propTypes = {
  period: PropTypes.instanceOf(BonusPeriod).isRequired,
  index: PropTypes.number.isRequired,
}

export default ManageBonusPeriod
