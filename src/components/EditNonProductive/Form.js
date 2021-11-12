import ConfirmButton from './ConfirmButton'
import AddPayElementButton from './AddPayElementButton'
import PayElements from './PayElements'
import AnnouncementContext from '@/components/AnnouncementContext'
import PageContext from '@/components/PageContext'
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { numberWithPrecision } from '@/utils/number'
import { saveTimesheet } from '@/utils/apiClient'

const Form = () => {
  const router = useRouter()

  const { operative, timesheet } = useContext(PageContext)

  const { setAnnouncement } = useContext(AnnouncementContext)
  const [confirmed, setConfirmed] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext()
  register('id', { value: timesheet.id })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'payElements',
    keyName: 'key',
  })

  const onSubmit = async (data) => {
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

  const convertPayElement = (pe) => {
    return {
      id: pe.id,
      payElementTypeId: pe.payElementTypeId,
      workOrder: pe.workOrder,
      address: pe.address,
      comment: pe.comment,
      monday: numberWithPrecision(pe.monday, 2),
      tuesday: numberWithPrecision(pe.tuesday, 2),
      wednesday: numberWithPrecision(pe.wednesday, 2),
      thursday: numberWithPrecision(pe.thursday, 2),
      friday: numberWithPrecision(pe.friday, 2),
      saturday: numberWithPrecision(pe.saturday, 2),
      sunday: numberWithPrecision(pe.sunday, 2),
      duration: numberWithPrecision(pe.duration, 2),
      value: numberWithPrecision(pe.value, 4),
    }
  }

  const payElements = timesheet.payElements

  useEffect(() => {
    append(
      payElements.filter((pe) => pe.isNonProductive).map(convertPayElement)
    )
  }, [append, payElements])

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
    <form id="update-timesheet" onSubmit={handleSubmit(onSubmit)}>
      {errors.payElements && (
        <p className="lbh-body-m">
          <span className="govuk-error-message lbh-error-message">
            <span className="govuk-visually-hidden">Error:</span> There are
            errors in the form - please ensure you have entered the details
            correctly.
          </span>
        </p>
      )}

      <PayElements fields={fields} remove={remove} />

      <div className="govuk-button-group govuk-!-margin-top-9">
        <ConfirmButton />
        <AddPayElementButton append={append} />
      </div>
    </form>
  )
}

export default Form
