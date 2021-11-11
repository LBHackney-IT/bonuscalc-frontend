import PageContext from '@/components/PageContext'
import { useContext } from 'react'
import { generateSummaryReport } from '@/utils/reports'

const Buttons = () => {
  const {
    operative,
    summary,
    summary: { bonusPeriod },
  } = useContext(PageContext)

  const downloadReport = () => {
    const pdf = generateSummaryReport(operative, summary)
    pdf.save(
      `${operative.id}-0092-${bonusPeriod.year}-${bonusPeriod.number}.pdf`
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
