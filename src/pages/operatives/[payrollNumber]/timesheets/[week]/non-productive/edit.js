import BackButton from '@/components/BackButton'
import NotFound from '@/components/NotFound'
import Spinner from '@/components/Spinner'
import EditNonProductive from '@/components/EditNonProductive'
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
      <BackButton
        href={`/operatives/${payrollNumber}/timesheets/${week}/non-productive`}
      />
      <EditNonProductive operative={operative} week={week} />
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
