import Link from 'next/link'
import PageContext from '@/components/PageContext'
import { useContext } from 'react'
import { generateWeeklyReport } from '@/utils/reports'

const Buttons = () => {
  const {
    operative,
    timesheet,
    timesheet: { week },
    timesheet: {
      week: { bonusPeriod },
    },
  } = useContext(PageContext)

  const baseUrl = `/operatives/${operative.id}/timesheets`

  const downloadReport = () => {
    const pdf = generateWeeklyReport(operative, timesheet)
    pdf.save(
      `${operative.id}-0093-${bonusPeriod.year}-${bonusPeriod.number}-${week.number}.pdf`
    )
  }

  return (
    <div className="govuk-button-group">
      <button
        className="govuk-button lbh-button"
        data-module="govuk-button"
        onClick={downloadReport}
      >
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
