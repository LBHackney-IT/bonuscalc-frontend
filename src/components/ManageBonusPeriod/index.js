import cx from 'classnames'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import LinkButton from '@/components/LinkButton'
import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
import { useState, useEffect } from 'react'
import { BonusPeriod } from '@/models'
import { useWeek } from '@/utils/apiClient'

const OperativeListItem = ({ operative, week }) => {
  const baseUrl = `/operatives/${operative.id}/timesheets`

  return (
    <li>
      <Link href={`${baseUrl}/${week.id}/productive`}>
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
        {operatives.length > 0 && (
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

const ManageWeek = ({ week, showAll }) => {
  const [isVisible, setIsVisible] = useState(week.isVisible)

  useEffect(() => {
    setIsVisible(week.isVisible || showAll)
  }, [week, showAll])

  return (
    isVisible && (
      <section
        className={cx('bc-open-weeks__week', {
          'bc-open-weeks__week--current': week.isCurrent,
        })}
      >
        <header>
          <h3>
            {week.description} <span>({week.dateRange})</span>
          </h3>
          {week.isCurrent && <p>Current week</p>}
        </header>
        {week.isFuture ? (
          <section className="bc-open-weeks__operatives">
            <header>
              <h4>Week not started</h4>
            </header>
          </section>
        ) : (
          <OperativeList date={week.id} />
        )}
      </section>
    )
  )
}

const ManageBonusPeriod = ({ period }) => {
  const [showAllWeeks, setShowAllWeeks] = useState(false)

  const toggleShowAllWeeks = () => {
    setShowAllWeeks(!showAllWeeks)
  }

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
        <ManageWeek week={week} key={index} showAll={showAllWeeks} />
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
