import PropTypes from 'prop-types'
import { useOperative } from '../../utils/apiClient'
import Heading from './Heading'
import NotFound from '../NotFound'
import Spinner from '../Spinner'
import Summary from './Summary'
import Tabs from './Tabs'

const OperativeView = ({ payrollNumber }) => {
  const { operative, isLoading, isError } = useOperative(payrollNumber)

  if (isLoading) return <Spinner />
  if (isError)
    return (
      <NotFound
        message={`Couldn\u2019t find an operative with the payroll number ${payrollNumber}.`}
      />
    )

  return (
    <section className="section">
      <Heading operative={operative} />
      <Summary operative={operative} />
      <Tabs operative={operative} />
    </section>
  )
}

OperativeView.propTypes = {
  payrollNumber: PropTypes.string.isRequired,
}

export default OperativeView
