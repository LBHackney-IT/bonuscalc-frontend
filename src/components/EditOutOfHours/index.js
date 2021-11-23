import AnnouncementContext from '@/components/AnnouncementContext'
import PageContext from '@/components/PageContext'
import MoneyForm from '@/components/MoneyForm'
import { useEffect, useContext, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/router'
import { PayElementType } from '@/models'
import { saveTimesheet } from '@/utils/apiClient'

const EditOutOfHours = () => {
  const router = useRouter()
  const methods = useForm()

  const { setAnnouncement } = useContext(AnnouncementContext)
  const { operative, timesheet } = useContext(PageContext)
  const { week } = timesheet

  const [confirmed, setConfirmed] = useState(false)

  const baseUrl = `/operatives/${operative.id}/timesheets`
  const summaryUrl = `${baseUrl}/${timesheet.weekId}/out-of-hours`

  const onSubmit = async (data) => {
    const [payElement] = data.payElements

    if (payElement.duration < 1) {
      data.payElements = []
    }

    timesheet.payElements.forEach((pe) => {
      if (!pe.isOutOfHours) {
        data.payElements.push(pe.toRow())
      }
    })

    if (await saveTimesheet(operative.id, timesheet.weekId, data)) {
      setConfirmed(true)

      router.push(summaryUrl)
    } else {
      setAnnouncement({
        title: 'Unable to save timesheet - please try again in a moment',
        isWarning: true,
      })
    }
  }

  useEffect(() => {
    const pushAnnouncement = () => {
      setAnnouncement({ title: 'Updated out of hours successfully' })
    }

    if (confirmed) {
      router.events.on('routeChangeComplete', pushAnnouncement)
    }

    return () => {
      router.events.off('routeChangeComplete', pushAnnouncement)
    }
  }, [confirmed, router.events, setAnnouncement])

  return (
    <>
      <section className="section">
        <h1 className="lbh-heading-h2">
          <span className="govuk-caption-l lbh-caption">{operative.name}</span>
          Edit out of hours
        </h1>
        <h2 className="lbh-heading-h3 govuk-!-margin-top-2">
          {week.description}
          <span className="govuk-caption-m lbh-caption">
            ({week.dateRange})
          </span>
        </h2>
      </section>

      <FormProvider {...methods}>
        <MoneyForm
          onSubmit={onSubmit}
          cancelUrl={summaryUrl}
          typeLabel="Out of hours"
          minDuration={0}
          maxDuration={21}
          minValue={0}
          maxValue={500}
          minDay={0}
          maxDay={3}
          rate={PayElementType.outOfHoursRate}
        />
      </FormProvider>
    </>
  )
}

export default EditOutOfHours
