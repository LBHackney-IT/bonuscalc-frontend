import Header from './Header'
import OutOfHoursRota from './OutOfHoursRota'
import OutOfHoursJobs from './OutOfHoursJobs'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import ButtonLink from '@/components/ButtonLink'
import PageContext from '@/components/PageContext'
import Pagination from '@/components/Pagination'
import { useContext } from 'react'

const OutOfHoursSummary = () => {
  const {
    operative,
    timesheet: { week },
  } = useContext(PageContext)
  const baseUrl = `/operatives/${operative.id}/timesheets/${week.id}`

  const downloadReport = () => {}

  return (
    <>
      <Header />
      <Pagination tab="out-of-hours" />
      <OutOfHoursRota />
      <OutOfHoursJobs />

      <ButtonGroup>
        <Button onClick={downloadReport}>Download report</Button>

        {week.isEditable && (
          <ButtonLink href={`${baseUrl}/out-of-hours/edit`} secondary={true}>
            Edit out of hours
          </ButtonLink>
        )}
      </ButtonGroup>
    </>
  )
}

export default OutOfHoursSummary
