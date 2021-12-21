import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import ManagePage from '@/components/ManagePage'
import ManageBonusPeriod from '@/components/ManageBonusPeriod'
import { useBonusPeriods } from '@/utils/apiClient'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'

const ManageWeeksPage = ({ userDetails }) => {
  const { bonusPeriods, isLoading, isError } = useBonusPeriods()

  if (isLoading) return <Spinner />
  if (isError || !bonusPeriods)
    return <NotFound>Couldn’t find any current bonus periods.</NotFound>

  return (
    <ManagePage user={userDetails} section="weeks">
      <section className="bc-open-weeks">
        <h1>Open weeks</h1>
        {bonusPeriods.length > 0 ? (
          <>
            {bonusPeriods.map((bp, index) => (
              <ManageBonusPeriod period={bp} index={index} key={index} />
            ))}
          </>
        ) : (
          <p>There are no open weeks currently.</p>
        )}
      </section>
    </ManagePage>
  )
}

ManageWeeksPage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
      currentPage: 'manage',
    },
  }
}

export default ManageWeeksPage
