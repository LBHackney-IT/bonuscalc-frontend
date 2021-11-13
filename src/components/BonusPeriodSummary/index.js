import Header from './Header'
import WeeklySummaries from './WeeklySummaries'
import Pagination from './Pagination'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import PageContext from '@/components/PageContext'
import { useContext } from 'react'
import { generateSummaryReport } from '@/utils/reports'

const BonusPeriodSummary = () => {
  const {
    operative,
    summary,
    summary: { bonusPeriod },
  } = useContext(PageContext)

  const downloadReport = () => {
    const pdf = generateSummaryReport(operative, summary)

    pdf.save(
      `${operative.id}-0092-${bonusPeriod.year}-${bonusPeriod.number}.pdf`
    )
  }

  return (
    <>
      <Header />
      <Pagination />
      <WeeklySummaries />

      <ButtonGroup>
        <Button onClick={downloadReport}>Download report</Button>
      </ButtonGroup>
    </>
  )
}

export default BonusPeriodSummary
