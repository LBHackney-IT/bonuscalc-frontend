import Header from './Header'
import WorkOrders from './WorkOrders'
import Adjustments from './Adjustments'
import NoProductiveTime from './NoProductiveTime'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import ButtonLink from '@/components/ButtonLink'
import PageContext from '@/components/PageContext'
import Pagination from '@/components/Pagination'
import UserContext from '@/components/UserContext'
import { isEditable } from '@/utils/auth'
import { generateWeeklyReport } from '@/utils/reports'
import { useContext } from 'react'

const ProductiveSummary = () => {
  const { user } = useContext(UserContext)

  const {
    operative,
    timesheet,
    timesheet: { week },
    timesheet: {
      hasAdjustmentPayElements,
      hasProductivePayElements,
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
      <Pagination tab="productive" />
      <>
        {hasAdjustmentPayElements || hasProductivePayElements ? (
          <>
            <WorkOrders />
            <Adjustments />
          </>
        ) : (
          <NoProductiveTime />
        )}
      </>

      <ButtonGroup>
        <Button onClick={downloadReport}>Download report</Button>

        {isEditable(operative, week, bonusPeriod, user) && (
          <ButtonLink href={`${baseUrl}/productive/edit`} secondary={true}>
            Edit productive
          </ButtonLink>
        )}
      </ButtonGroup>
    </>
  )
}

export default ProductiveSummary
