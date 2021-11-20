import Header from './Header'
import OutOfHoursRota from './OutOfHoursRota'
import OutOfHoursJobs from './OutOfHoursJobs'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import Pagination from '@/components/Pagination'

const OutOfHoursSummary = () => {
  const downloadReport = () => {}

  return (
    <>
      <Header />
      <Pagination tab="out-of-hours" />
      <OutOfHoursRota />
      <OutOfHoursJobs />

      <ButtonGroup>
        <Button onClick={downloadReport}>Download report</Button>
      </ButtonGroup>
    </>
  )
}

export default OutOfHoursSummary
