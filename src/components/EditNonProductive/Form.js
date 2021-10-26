import PropTypes from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm, useFormState } from 'react-hook-form'
import AnnouncementContext from '../AnnouncementContext'
import { Operative, Week } from '@/models'

const Form = ({ operative, week }) => {
  const { handleSubmit, control } = useForm({
    reValidateMode: 'onSubmit',
  })

  const { isSubmitting } = useFormState({ control })
  const router = useRouter()

  const { setAnnouncement } = useContext(AnnouncementContext)
  const [confirmed, setConfirmed] = useState(false)

  const onSubmit = () => {
    setConfirmed(true)
    router.push(
      `/operatives/${operative.id}/timesheets/${week.id}/non-productive`
    )
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
    <form id="update-timesheet" onSubmit={handleSubmit(onSubmit)}>
      <div className="govuk-button-group govuk-!-margin-top-9">
        <button
          id="confirm-button"
          type="submit"
          disabled={isSubmitting}
          className="govuk-button lbh-button"
          data-module="govuk-button"
        >
          {isSubmitting ? <>Confirming ...</> : <>Confirm</>}
        </button>

        <button
          id="add-element-button"
          type="button"
          className="govuk-button lbh-button lbh-button--add"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M6.94 0L5 0V12H6.94V0Z" />
            <path d="M12 5H0V7H12V5Z" />
          </svg>
          Add pay element
        </button>

        <button
          id="add-adjustment-button"
          type="button"
          className="govuk-button lbh-button lbh-button--add"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M6.94 0L5 0V12H6.94V0Z" />
            <path d="M12 5H0V7H12V5Z" />
          </svg>
          Add adjustment
        </button>
      </div>
    </form>
  )
}

Form.propTypes = {
  operative: PropTypes.instanceOf(Operative).isRequired,
  week: PropTypes.instanceOf(Week).isRequired,
}

export default Form
