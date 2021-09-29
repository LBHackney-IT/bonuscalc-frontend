import OperativeSearch from '../components/OperativeSearch'
import { OPERATIVE_MANAGER_ROLE } from '../utils/user'

const HomePage = ({ query }) => {
  return (
    <>
      <section className="section">
        <OperativeSearch query={query} />
      </section>
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

HomePage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default HomePage
