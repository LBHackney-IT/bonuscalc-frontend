import BackButton from '@/components/BackButton'
import NotFound from '@/components/NotFound'
import Spinner from '@/components/Spinner'
import CloseWeek from '@/components/CloseWeek'
import { useWeek } from '@/utils/apiClient'
import { WEEK_MANAGER_ROLE } from '@/utils/user'

const CloseWeekPage = ({ query }) => {
  const { week, isLoading, isError } = useWeek(query.week)

  if (isLoading) return <Spinner />
  if (isError || !week)
    return <NotFound>Couldn’t find the week beginning {query.week}.</NotFound>

  return (
    <>
      <BackButton href="/manage/weeks" />
      <CloseWeek week={week} />
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

CloseWeekPage.permittedRoles = [WEEK_MANAGER_ROLE]

export default CloseWeekPage
