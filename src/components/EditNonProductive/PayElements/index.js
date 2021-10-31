import PropTypes from 'prop-types'
import PayElementsHeader from './Header'
import PayElementsBody from './Body'
import { Table } from '@/components/Table'

const PayElements = ({ fields, remove }) => {
  return (
    <Table id="pay-elements">
      <PayElementsHeader />
      <PayElementsBody fields={fields} remove={remove} />
    </Table>
  )
}

PayElements.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.instanceOf(Object).isRequired).isRequired,
  remove: PropTypes.func.isRequired,
}

export default PayElements
