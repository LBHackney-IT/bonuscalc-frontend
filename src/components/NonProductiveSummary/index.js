import Header from './Header'
import PayElements from './PayElements'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import ButtonLink from '@/components/ButtonLink'
import PageContext from '@/components/PageContext'
import Pagination from '@/components/Pagination'
import UserContext from '@/components/UserContext'
import { isEditable } from '@/utils/auth'
import { generateWeeklyReport } from '@/utils/reports'
import { useContext } from 'react'

const NonProductiveSummary = () => {
  const { user } = useContext(UserContext)

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

        {isEditable(operative, week, bonusPeriod, user) && (
          <ButtonLink href={`${baseUrl}/non-productive/edit`} secondary={true}>
            Edit non-productive
          </ButtonLink>
        )}
      </ButtonGroup>
    </>
  )
}

export default NonProductiveSummary
