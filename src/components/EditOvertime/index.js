import AnnouncementContext from '@/components/AnnouncementContext'
import PageContext from '@/components/PageContext'
import OvertimeForm from './OvertimeForm'
import { useEffect, useContext, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/router'
import { PayElementType } from '@/models'
import { saveTimesheet } from '@/utils/apiClient'

const EditOvertime = () => {
  const router = useRouter()
  const methods = useForm()

  const { setAnnouncement } = useContext(AnnouncementContext)
  const { operative, timesheet } = useContext(PageContext)
  const { week } = timesheet

  const [confirmed, setConfirmed] = useState(false)

  const baseUrl = `/operatives/${operative.id}/timesheets`
  const summaryUrl = `${baseUrl}/${timesheet.weekId}/overtime`

  const onSubmit = async (data) => {
    timesheet.payElements.forEach((pe) => {
      if (!pe.isOvertime) {
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
      setAnnouncement({ title: 'Updated overtime successfully' })
    }
  }, [confirmed, setAnnouncement])

  return (
    <>
      <section>
        <h1 className="lbh-heading-h2">
          <span className="govuk-caption-l lbh-caption">{operative.name}</span>
          Edit overtime
        </h1>
        <h2 className="lbh-heading-h3 govuk-!-margin-top-2">
          {week.description}
          <span className="govuk-caption-m lbh-caption">
            ({week.dateRange})
          </span>
        </h2>
      </section>

      <FormProvider {...methods}>
        <OvertimeForm
          onSubmit={onSubmit}
          appendLabel="Add overtime"
          rate={PayElementType.overtimeRate}
        >
          There is no manually added overtime for this week.
        </OvertimeForm>
      </FormProvider>
    </>
  )
}

export default EditOvertime
