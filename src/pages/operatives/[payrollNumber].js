import BackButton from '@/components/BackButton'
import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useOperative } from '@/utils/apiClient'
import { BonusPeriod } from '@/models'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'

const OperativePage = ({ query }) => {
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
      <>
        <BackButton href="/" />
        <NotFound
          message={`Couldn\u2019t find an operative with the payroll number ${payrollNumber}.`}
        />
      </>
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

OperativePage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default OperativePage
