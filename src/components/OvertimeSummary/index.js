import Header from './Header'
import NoOvertime from './NoOvertime'
import OvertimeHours from './OvertimeHours'
import OvertimeJobs from './OvertimeJobs'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import ButtonLink from '@/components/ButtonLink'
import PageContext from '@/components/PageContext'
import Pagination from '@/components/Pagination'
import UserContext from '@/components/UserContext'
import { isEditable } from '@/utils/auth'
import { generateOvertimeReport } from '@/utils/reports'
import { useContext } from 'react'

const OvertimeSummary = () => {
  const { user } = useContext(UserContext)

  const {
    operative,
    timesheet,
    timesheet: {
      week,
      hasOvertimeJobs,
      hasOvertimeHours,
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
      <>
        {hasOvertimeJobs || hasOvertimeHours ? (
          <>
            <OvertimeJobs />
            <OvertimeHours />
          </>
        ) : (
          <NoOvertime />
        )}
      </>

      <ButtonGroup>
        <Button onClick={downloadReport}>Download report</Button>

        {isEditable(operative, week, bonusPeriod, user) && (
          <ButtonLink href={`${baseUrl}/overtime/edit`} secondary={true}>
            Edit overtime
          </ButtonLink>
        )}
      </ButtonGroup>
    </>
  )
}

export default OvertimeSummary
