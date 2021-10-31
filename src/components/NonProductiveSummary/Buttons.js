import Link from 'next/link'
import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const Buttons = () => {
  const {
    operative,
    timesheet: { week },
  } = useContext(PageContext)

  const baseUrl = `/operatives/${operative.id}/timesheets`

  return (
    <div className="govuk-button-group">
      <button className="govuk-button lbh-button" data-module="govuk-button">
        Download report
      </button>

      {week.isEditable && (
        <Link href={`${baseUrl}/${week.id}/non-productive/edit`}>
          <a
            role="button"
            draggable="false"
            className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
            data-module="govuk-button"
          >
            Edit non-productive
          </a>
        </Link>
      )}
    </div>
  )
}

export default Buttons
