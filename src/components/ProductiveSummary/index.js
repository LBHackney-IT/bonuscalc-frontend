import Header from './Header'
import WorkOrders from './WorkOrders'
import ButtonGroup from '@/components/ButtonGroup'
import Button from '@/components/Button'
import Pagination from '@/components/Pagination'
import PageContext from '@/components/PageContext'
import { useContext } from 'react'
import { generateWeeklyReport } from '@/utils/reports'

const ProductiveSummary = () => {
  const {
    operative,
    timesheet,
    timesheet: { week },
    timesheet: {
      week: { bonusPeriod },
    },
  } = useContext(PageContext)

  const downloadReport = () => {
    const pdf = generateWeeklyReport(operative, timesheet)

    pdf.save(
      `${operative.id}-0093-${bonusPeriod.year}-${bonusPeriod.number}-${week.number}.pdf`
    )
  }

  return (
    <>
      <Header />
      <Pagination tab="productive" />
      <WorkOrders />

      <ButtonGroup>
        <Button onClick={downloadReport}>Download report</Button>
      </ButtonGroup>
    </>
  )
}

export default ProductiveSummary
