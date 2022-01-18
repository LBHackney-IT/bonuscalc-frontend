import Header from './Header'
import OvertimeHours from './OvertimeHours'
import OvertimeJobs from './OvertimeJobs'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import ButtonLink from '@/components/ButtonLink'
import PageContext from '@/components/PageContext'
import Pagination from '@/components/Pagination'
import { useContext } from 'react'

const OvertimeSummary = () => {
  const {
    operative,
    timesheet: { week },
  } = useContext(PageContext)
  const baseUrl = `/operatives/${operative.id}/timesheets/${week.id}`

  const downloadReport = () => {}

  return (
    <>
      <Header />
      <Pagination tab="overtime" />
      <OvertimeHours />
      <OvertimeJobs />

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
