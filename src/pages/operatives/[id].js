import { useEffect, useState } from 'react'
import BackButton from '../../components/BackButton'
import OperativeView from '../../components/OperativeView'
import Spinner from '../../components/Spinner'
import NotFound from '../../components/NotFound'
import { Operative } from '../../models'
import { OPERATIVE_MANAGER_ROLE } from '../../utils/user'

const OperativePage = ({ query }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [operative, setOperative] = useState(null)

  const getOperative = async (payrollNumber) => {
    setError(null)

    try {
      const response = await Operative.find(payrollNumber)
      setOperative(response.data)
    } catch (error) {
      setError(error)
      setOperative(null)
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    getOperative(query.id)
  }, [query.id])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <BackButton href="/" />
          {operative && <OperativeView operative={operative} />}
          {error && (
            <NotFound
              message={`Couldn&apos;t find an operative with the payroll number ${query.id}.`}
            />
          )}
        </>
      )}
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

OperativePage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default OperativePage
