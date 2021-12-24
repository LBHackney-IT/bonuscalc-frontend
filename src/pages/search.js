import OperativeSearch from '@/components/OperativeSearch'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'

const SearchPage = ({ query }) => {
  return (
    <>
      <section>
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
      currentPage: 'search',
    },
  }
}

SearchPage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default SearchPage
