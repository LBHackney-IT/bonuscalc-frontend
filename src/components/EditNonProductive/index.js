import AnnouncementContext from '@/components/AnnouncementContext'
import PageContext from '@/components/PageContext'
import PayElementsForm from '@/components/PayElementsForm'
import { useEffect, useContext, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/router'
import { saveTimesheet } from '@/utils/apiClient'

const EditNonProductive = () => {
  const router = useRouter()
  const methods = useForm()

  const { setAnnouncement } = useContext(AnnouncementContext)
  const { operative, timesheet } = useContext(PageContext)
  const { week } = timesheet

  const [confirmed, setConfirmed] = useState(false)

  const onSubmit = async (data) => {
    const { adjustmentPayElements } = timesheet

    adjustmentPayElements.map((pe) => {
      data.payElements.push(pe.toRow())
    })

    if (await saveTimesheet(operative.id, timesheet.weekId, data)) {
      setConfirmed(true)

      router.push(
        `/operatives/${operative.id}/timesheets/${timesheet.weekId}/non-productive`
      )
    } else {
      setAnnouncement({
        title: 'Unable to save timesheet - please try again in a moment',
        isWarning: true,
      })
    }
  }

  useEffect(() => {
    const pushAnnouncement = () => {
      setAnnouncement({ title: 'Updated non-productive time successfully' })
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
          Edit non-productive time
        </h1>
        <h2 className="lbh-heading-h3 govuk-!-margin-top-2">
          {week.description}
          <span className="govuk-caption-m lbh-caption">
            ({week.dateRange})
          </span>
        </h2>
      </section>

      <FormProvider {...methods}>
        <PayElementsForm
          onSubmit={onSubmit}
          appendLabel="Add non-productive"
          minDuration={0}
          maxDuration={168.0}
          minValue={0}
          maxValue={13540}
          minDay={0}
          maxDay={24}
        >
          There are no non-productive items for this week.
        </PayElementsForm>
      </FormProvider>
    </>
  )
}

export default EditNonProductive
