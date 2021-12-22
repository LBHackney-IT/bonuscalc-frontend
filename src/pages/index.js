import Spinner from '@/components/Spinner'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'

const HomeRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/manage/weeks')
  })

  return <Spinner />
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
    },
  }
}

HomeRedirect.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default HomeRedirect
