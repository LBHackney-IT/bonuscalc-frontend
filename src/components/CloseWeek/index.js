import PropTypes from 'prop-types'
import AnnouncementContext from '@/components/AnnouncementContext'
import ButtonGroup from '@/components/ButtonGroup'
import Button from '@/components/Button'
import UserContext from '@/components/UserContext'
import dayjs from '@/utils/date'
import { useContext, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Week } from '@/models'
import { sendReportEmail } from '@/utils/email'
import {
  saveWeek,
  saveReportSentAt,
  saveReportsSentAt,
} from '@/utils/apiClient'

const Summary = ({ week }) => {
  const operatives = week.operativeSummaries
  const zeroSMVOperatives = operatives.filter((o) => o.totalValue == 0)

  return (
    <div className="bc-close-week__summary">
      <h1>Close week and send reports</h1>
      <p>
        <span>
          Summary for <span>{week.description}</span>
        </span>
        <span>({week.dateRange})</span>
      </p>

      <dl className="govuk-!-margin-top-6">
        <div>
          <dt>Total number of operatives</dt>
          <dd>{operatives.length}</dd>
        </div>

        <div>
          <dt>Operatives with no SMVs</dt>
          <dd>{zeroSMVOperatives.length}</dd>
        </div>
      </dl>
    </div>
  )
}

const Progress = ({ sending, sent, total }) => {
  if (!sending) return <></>

  return (
    <div className="bc-close-week__progress">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={sent}
        style={{ width: `${Math.round((sent / total) * 100)}%` }}
      >
        <span>
          Progress: {sent} of {total} reports
        </span>
      </div>
    </div>
  )
}

const CloseWeek = ({ week }) => {
  const closeButton = useRef(null)
  const resumeButton = useRef(null)
  const router = useRouter()

  const total = week.operativeCount

  const [completed, setCompleted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(week.sentOperativeCount)

  const { user } = useContext(UserContext)
  const { setAnnouncement } = useContext(AnnouncementContext)

  const sendReports = async () => {
    for (const operative of week.operativeSummaries) {
      if (!operative.reportSentAt) {
        if (await sendReportEmail(operative.id, week.bonusPeriod.id)) {
          if (await saveReportSentAt(operative.id, week.id)) {
            operative.reportSentAt = dayjs()
            setSent((current) => current + 1)
          }
        }
      }
    }

    if (await saveReportsSentAt(week.id)) {
      setCompleted(true)
    }
  }

  const closeWeekAndSendReports = async () => {
    closeButton.current.disabled = true

    const data = {
      closedAt: dayjs(),
      closedBy: user.email,
    }

    if (await saveWeek(week.id, data)) {
      setSending(true)
      await sendReports()
    }
  }

  const resumeSendingReports = async () => {
    resumeButton.current.disabled = true
    setSending(true)
    await sendReports()
  }

  useEffect(() => {
    const pushAnnouncement = () => {
      setAnnouncement({
        title: `Week ${week.number} is successfully closed – weekly and summary reports have been sent`,
      })
    }

    if (completed) {
      router.events.on('routeChangeComplete', pushAnnouncement)
      router.push('/manage/weeks')
    }

    return () => {
      router.events.off('routeChangeComplete', pushAnnouncement)
    }
  }, [completed, router, setAnnouncement, week.number])

  return (
    <section className="bc-close-week">
      <Summary week={week} />
      <ButtonGroup>
        {week.isEditable ? (
          <Button ref={closeButton} onClick={closeWeekAndSendReports}>
            {sending ? <>Sending reports</> : <>Close and send reports</>}
          </Button>
        ) : (
          <Button ref={resumeButton} onClick={resumeSendingReports}>
            {sending ? <>Sending reports</> : <>Resume sending reports</>}
          </Button>
        )}
      </ButtonGroup>
      <Progress sending={sending} sent={sent} total={total} />
    </section>
  )
}

CloseWeek.propTypes = {
  week: PropTypes.instanceOf(Week).isRequired,
}

export default CloseWeek
