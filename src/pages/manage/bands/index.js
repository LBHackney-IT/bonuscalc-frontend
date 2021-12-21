import ManagePage from '@/components/ManagePage'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'

const ManageBandsPage = ({ userDetails }) => {
  return (
    <ManagePage user={userDetails} section="bands">
      <h1 className="lbh-heading-h2">Band change</h1>
      <p className="lbh-body">Under construction</p>
    </ManagePage>
  )
}

ManageBandsPage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
      currentPage: 'manage',
    },
  }
}

export default ManageBandsPage
