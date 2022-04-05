import Header from './Header'
import OutOfHoursRota from './OutOfHoursRota'
import OutOfHoursJobs from './OutOfHoursJobs'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import ButtonLink from '@/components/ButtonLink'
import PageContext from '@/components/PageContext'
import Pagination from '@/components/Pagination'
import { generateOutOfHoursReport } from '@/utils/reports'
import { useContext } from 'react'

const OutOfHoursSummary = () => {
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
    const pdf = generateOutOfHoursReport(operative, timesheet)

    pdf.save(
      `${operative.id}-0093-${bonusPeriod.year}-${bonusPeriod.number}-${week.number}-out-of-hours.pdf`
    )
  }

  return (
    <>
      <Header />
      <Pagination tab="out-of-hours" />
      <OutOfHoursRota />
      <OutOfHoursJobs />

      <ButtonGroup>
        <Button onClick={downloadReport}>Download report</Button>

        {week.isEditable && operative.isEditable && (
          <ButtonLink href={`${baseUrl}/out-of-hours/edit`} secondary={true}>
            Edit out of hours
          </ButtonLink>
        )}
      </ButtonGroup>
    </>
  )
}

export default OutOfHoursSummary
