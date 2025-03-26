import PropTypes from 'prop-types'
import ButtonGroup from '@/components/ButtonGroup'
import Button from '@/components/Button'
import AnnouncementContext from '@/components/AnnouncementContext'
import UserContext from '@/components/UserContext'
import dayjs from '@/utils/date'
import { useRouter } from 'next/router'
import { useContext, useRef, useState } from 'react'
import { BandChange, BonusPeriod } from '@/models/BonusPeriod'
import { saveBonusPeriod, saveBandChangeReportSentAt } from '@/utils/apiClient'
import { sendBandChangeReportEmail } from '@/utils/email'

const Summary = ({ period, bandChanges }) => {
  return (
    <div className="bc-close-period__summary">
      <h1>Close period and send reports</h1>
      <p>
        <span>
          Summary for <span>{period.description}</span>
        </span>
        <span>({period.dateRange})</span>
      </p>

      <dl className="govuk-!-margin-top-6">
        <div>
          <dt>Total number of operatives</dt>
          <dd>{bandChanges.length}</dd>
        </div>
      </dl>
    </div>
  )
}

const Progress = ({ sending, sent, total }) => {
  if (!sending) return <></>

  return (
    <div className="bc-close-period__progress">
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

const CloseBonusPeriod = ({ period, bandChanges }) => {
  const closeButton = useRef(null)
  const router = useRouter()

  const sentBandChanges = bandChanges.filter((bc) => bc.hasBeenSent)
  const total = bandChanges.length

  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(sentBandChanges.length)

  const { user } = useContext(UserContext)
  const { setAnnouncement } = useContext(AnnouncementContext)

  const sendReports = async () => {
    for (const bandChange of bandChanges) {
      if (!bandChange.hasBeenSent) {
        if (await sendBandChangeReportEmail(bandChange.operativeId)) {
          if (await saveBandChangeReportSentAt(bandChange.operativeId)) {
            bandChange.reportSentAt = dayjs()
            setSent((current) => current + 1)
          }
        }
      }
    }
  }

  const sendReportsAndClosePeriod = async () => {
    closeButton.current.disabled = true

    setSending(true)
    await sendReports()

    const data = {
      closedAt: dayjs(),
      closedBy: user.email,
    }

    if (await saveBonusPeriod(period.id, data)) {
      setTimeout(() => {
        setAnnouncement({
          title: `${period.description} is successfully closed – summary reports have been sent`,
        })
      }, 100)

      router.push('/manage/weeks')
    }
  }

  return (
    <section className="bc-close-period">
      <Summary period={period} bandChanges={bandChanges} />
      <ButtonGroup>
        <Button ref={closeButton} onClick={sendReportsAndClosePeriod}>
          {sending ? (
            <>Sending reports</>
          ) : sentBandChanges.length > 0 ? (
            <>Resume sending reports</>
          ) : (
            <>Close and send reports</>
          )}
        </Button>
      </ButtonGroup>
      <Progress sending={sending} sent={sent} total={total} />
    </section>
  )
}

CloseBonusPeriod.propTypes = {
  period: PropTypes.instanceOf(BonusPeriod).isRequired,
  bandChanges: PropTypes.arrayOf(PropTypes.instanceOf(BandChange).isRequired)
    .isRequired,
}

export default CloseBonusPeriod
