import OperativePage from '@/components/OperativePage'
import ProductiveSummary from '@/components/ProductiveSummary'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'

const ProductivePage = ({ query }) => (
  <OperativePage query={query} tab={1} component={ProductiveSummary} />
)

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
    },
  }
}

ProductivePage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default ProductivePage
