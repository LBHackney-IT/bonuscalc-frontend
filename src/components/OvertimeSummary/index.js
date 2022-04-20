import Header from './Header'
import OvertimeHours from './OvertimeHours'
import OvertimeJobs from './OvertimeJobs'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import ButtonLink from '@/components/ButtonLink'
import PageContext from '@/components/PageContext'
import Pagination from '@/components/Pagination'
import { generateOvertimeReport } from '@/utils/reports'
import { useContext } from 'react'

const OvertimeSummary = () => {
  const {
    operative,
    timesheet,
    timesheet: {
      week,
      week: { bonusPeriod },
    },
  } = useContext(PageContext)
  const baseUrl = `/operatives/${operative.id}/timesheets/${week.id}`

  const downloadReport = () => {
    const pdf = generateOvertimeReport(operative, timesheet)

    pdf.save(
      `${operative.id}-0093-${bonusPeriod.year}-${bonusPeriod.number}-${week.number}-overtime.pdf`
    )
  }

  return (
    <>
      <Header />
      <Pagination tab="overtime" />
      <OvertimeJobs />
      <OvertimeHours />

      <ButtonGroup>
        <Button onClick={downloadReport}>Download report</Button>

        {week.isEditable && operative.isEditable && (
          <ButtonLink href={`${baseUrl}/overtime/edit`} secondary={true}>
            Edit overtime
          </ButtonLink>
        )}
      </ButtonGroup>
    </>
  )
}

export default OvertimeSummary
