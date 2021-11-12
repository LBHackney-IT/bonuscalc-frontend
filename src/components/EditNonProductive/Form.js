import PayElements from './PayElements'
import AnnouncementContext from '@/components/AnnouncementContext'
import ButtonGroup from '@/components/ButtonGroup'
import ConfirmButton from '@/components/ConfirmButton'
import AddElementButton from '@/components/AddElementButton'
import PageContext from '@/components/PageContext'
import { PayElement } from '@/models'
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { saveTimesheet } from '@/utils/apiClient'

const Form = () => {
  const router = useRouter()
  const { operative, timesheet, payElements } = useContext(PageContext)
  const { setAnnouncement } = useContext(AnnouncementContext)
  const [confirmed, setConfirmed] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  useEffect(() => {
    if (!initialized) {
      append(payElements.map((pe) => pe.toRow()))
      setInitialized(true)
    }
  }, [append, payElements, initialized])

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

  const addPayElement = () => {
    append(PayElement.defaultRow)
  }

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

      <ButtonGroup className="govuk-!-margin-top-9">
        <ConfirmButton disabled={isSubmitting}>
          {isSubmitting ? <>Confirming ...</> : <>Confirm</>}
        </ConfirmButton>

        <AddElementButton onClick={addPayElement}>
          Add pay element
        </AddElementButton>
      </ButtonGroup>
    </form>
  )
}

export default Form
