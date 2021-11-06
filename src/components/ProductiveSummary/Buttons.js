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
    </div>
  )
}

export default Buttons
