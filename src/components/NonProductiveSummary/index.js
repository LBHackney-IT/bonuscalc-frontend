import Header from './Header'
import PayElements from './PayElements'
import Buttons from './Buttons'
import Pagination from '@/components/Pagination'

const NonProductiveSummary = () => {
  return (
    <>
      <Header />
      <Pagination tab="non-productive" />
      <PayElements />
      <Buttons />
    </>
  )
}

export default NonProductiveSummary
