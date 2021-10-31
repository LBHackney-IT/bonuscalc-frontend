import Header from './Header'
import PayElements from './PayElements'
import Adjustments from './Adjustments'
import Buttons from './Buttons'
import Pagination from '@/components/Pagination'

const NonProductiveSummary = () => {
  return (
    <>
      <Header />
      <Pagination tab="non-productive" />
      <PayElements />
      <Adjustments />
      <Buttons />
    </>
  )
}

export default NonProductiveSummary
