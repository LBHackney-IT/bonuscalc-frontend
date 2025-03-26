import AnnouncementContext from '@/components/AnnouncementContext'
import PageContext from '@/components/PageContext'
import PayElementsForm from '@/components/PayElementsForm'
import { useEffect, useContext, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/router'
import { saveTimesheet } from '@/utils/apiClient'

const EditProductive = () => {
  const router = useRouter()
  const methods = useForm()

  const { setAnnouncement } = useContext(AnnouncementContext)
  const { operative, timesheet } = useContext(PageContext)
  const { week } = timesheet

  const [confirmed, setConfirmed] = useState(false)

  const baseUrl = `/operatives/${operative.id}/timesheets`
  const summaryUrl = `${baseUrl}/${timesheet.weekId}/productive`

  const onSubmit = async (data) => {
    timesheet.payElements.map((pe) => {
      if (!pe.isProductive) {
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
    if (confirmed) {
      setAnnouncement({ title: 'Updated productive time successfully' })
    }
  }, [confirmed, setAnnouncement])

  return (
    <>
      <section>
        <h1 className="lbh-heading-h2">
          <span className="govuk-caption-l lbh-caption">{operative.name}</span>
          Edit productive time
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
          appendLabel="Add productive"
          minDuration={-420}
          maxDuration={420}
          minValue={-25200}
          maxValue={25200}
          minDay={-60}
          maxDay={60}
        >
          There are no editable productive items for this week.
        </PayElementsForm>
      </FormProvider>
    </>
  )
}

export default EditProductive
