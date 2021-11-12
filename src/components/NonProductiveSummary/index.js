import Header from './Header'
import PayElements from './PayElements'
import ButtonGroup from '@/components/ButtonGroup'
import Button from '@/components/Button'
import ButtonLink from '@/components/ButtonLink'
import Pagination from '@/components/Pagination'
import PageContext from '@/components/PageContext'
import { useContext } from 'react'
import { generateWeeklyReport } from '@/utils/reports'

const NonProductiveSummary = () => {
  const {
    operative,
    timesheet,
    timesheet: { week },
    timesheet: {
      week: { bonusPeriod },
    },
  } = useContext(PageContext)

  const baseUrl = `/operatives/${operative.id}/timesheets/${week.id}`

  const downloadReport = () => {
    const pdf = generateWeeklyReport(operative, timesheet)

    pdf.save(
      `${operative.id}-0093-${bonusPeriod.year}-${bonusPeriod.number}-${week.number}.pdf`
    )
  }

  return (
    <>
      <Header />
      <Pagination tab="non-productive" />
      <PayElements />

      <ButtonGroup>
        <Button onClick={downloadReport}>Download report</Button>

        {week.isEditable && (
          <ButtonLink href={`${baseUrl}/non-productive/edit`} secondary={true}>
            Edit non-productive
          </ButtonLink>
        )}
      </ButtonGroup>
    </>
  )
}

export default NonProductiveSummary
