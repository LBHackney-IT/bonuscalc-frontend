import Header from './Header'
import WorkOrders from './WorkOrders'
import Buttons from './Buttons'
import Pagination from '@/components/Pagination'

const ProductiveSummary = () => {
  return (
    <>
      <Header />
      <Pagination tab="productive" />
      <WorkOrders />
      <Buttons />
    </>
  )
}

export default ProductiveSummary
