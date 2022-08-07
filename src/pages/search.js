import CombinedSearch from '@/components/CombinedSearch'
import {
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
} from '@/utils/user'

const SearchPage = () => {
  return (
    <>
      <section className="govuk-!-margin-bottom-9">
        <CombinedSearch />
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

SearchPage.permittedRoles = [
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
]

export default SearchPage
