import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import ManagePage from '@/components/ManagePage'
import Authorisations from '@/components/Authorisations'
import { useBandChangePeriod } from '@/utils/apiClient'
import { AUTHORISATIONS_MANAGER_ROLE } from '@/utils/user'

const ManageAuthorisationsPage = ({ userDetails }) => {
  const { bonusPeriod, isLoading, isError } = useBandChangePeriod()

  if (isLoading) return <Spinner />
  if (isError || !bonusPeriod)
    return <NotFound>Couldn’t find a current bonus period.</NotFound>

  return (
    <ManagePage user={userDetails} section="authorisations">
      <Authorisations period={bonusPeriod} />
    </ManagePage>
  )
}

ManageAuthorisationsPage.permittedRoles = [AUTHORISATIONS_MANAGER_ROLE]

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
      currentPage: 'manage',
    },
  }
}

export default ManageAuthorisationsPage
