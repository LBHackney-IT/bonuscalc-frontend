import PageContext from '@/components/PageContext'
import BackButton from '@/components/BackButton'
import OperativeSummary from '@/components/OperativeSummary'
import OperativeTabs from '@/components/OperativeTabs'
import NotFound from '@/components/NotFound'
import Spinner from '@/components/Spinner'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'
import { useOperative } from '@/utils/apiClient'

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
    <PageContext.Provider value={{ operative, week }}>
      <BackButton href="/" />
      <OperativeSummary />
      <OperativeTabs current={3} />
    </PageContext.Provider>
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
