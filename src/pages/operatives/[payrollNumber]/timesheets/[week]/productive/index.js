import BackButton from '@/components/BackButton'
import OperativeSummary from '@/components/OperativeSummary'
import OperativeTabs from '@/components/OperativeTabs'
import ProductiveSummary from '@/components/ProductiveSummary'
import NotFound from '@/components/NotFound'
import Spinner from '@/components/Spinner'
import { useOperative } from '@/utils/apiClient'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'

const OperativePage = ({ query }) => {
  const { payrollNumber, week } = query
  const { operative, isLoading, isError } = useOperative(payrollNumber)

  if (isLoading) return <Spinner />
  if (isError || !operative)
    return (
      <NotFound
        message={`Couldn\u2019t find an operative with the payroll number ${payrollNumber}.`}
      />
    )

  return (
    <>
      <BackButton href="/" />
      <OperativeSummary operative={operative} />
      <OperativeTabs operative={operative} week={week} tabIndex={1}>
        <ProductiveSummary operative={operative} week={week} />
      </OperativeTabs>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
    },
  }
}

OperativePage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default OperativePage
