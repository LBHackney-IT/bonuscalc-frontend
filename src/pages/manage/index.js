import Spinner from '@/components/Spinner'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
} from '@/utils/user'

const ManageRedirect = () => {
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

ManageRedirect.permittedRoles = [
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
]

export default ManageRedirect
