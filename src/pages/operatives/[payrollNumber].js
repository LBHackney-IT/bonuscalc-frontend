import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useOperative } from '@/utils/apiClient'
import { BonusPeriod } from '@/models'
import { OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE } from '@/utils/user'

const OperativeRedirect = ({ query }) => {
  const { payrollNumber } = query
  const { operative, isLoading, isError } = useOperative(payrollNumber)
  const router = useRouter()
  const bonusPeriod = BonusPeriod.current

  useEffect(() => {
    if (operative) {
      const baseUrl = `/operatives/${operative.id}`
      const redirectUrl = `${baseUrl}/summaries/${bonusPeriod}`

      router.push(redirectUrl)
    }
  }, [operative, bonusPeriod, router])

  if (isLoading) return <Spinner />
  if (isError || !operative)
    return (
      <NotFound>
        Couldn’t find an operative with the payroll number {payrollNumber}.
      </NotFound>
    )

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

OperativeRedirect.permittedRoles = [OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE]

export default OperativeRedirect
