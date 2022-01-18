import ManagePage from '@/components/ManagePage'
import { OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE } from '@/utils/user'

const ManageReportsPage = ({ userDetails }) => {
  return (
    <ManagePage user={userDetails} section="reports">
      <h1 className="lbh-heading-h2">Reports</h1>
      <p className="lbh-body">Under construction</p>
    </ManagePage>
  )
}

ManageReportsPage.permittedRoles = [OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE]

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
      currentPage: 'manage',
    },
  }
}

export default ManageReportsPage
