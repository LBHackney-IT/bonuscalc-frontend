import Header from './Header'
import OvertimeHours from './OvertimeHours'
import OvertimeJobs from './OvertimeJobs'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import Pagination from '@/components/Pagination'

const OvertimeSummary = () => {
  const downloadReport = () => {}

  return (
    <>
      <Header />
      <Pagination tab="overtime" />
      <OvertimeHours />
      <OvertimeJobs />

      <ButtonGroup>
        <Button onClick={downloadReport}>Download report</Button>
      </ButtonGroup>
    </>
  )
}

export default OvertimeSummary
