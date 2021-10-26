import PropTypes from 'prop-types'
import PayElementsHeader from './Header'
import PayElementsBody from './Body'
import { Table } from '@/components/Table'
import { PayElementType } from '@/models'
import { compareStrings } from '@/utils/string'
import { useFormContext } from 'react-hook-form'

const PayElements = ({ fields, remove, payElementTypes }) => {
  const types = payElementTypes
    .filter((pet) => pet.nonProductive)
    .sort((a, b) => compareStrings(a.description, b.description))

  const {
    formState: { errors },
  } = useFormContext()

  console.log(errors)

  return (
    <Table id="pay-elements">
      <PayElementsHeader />
      <PayElementsBody
        fields={fields}
        remove={remove}
        payElementTypes={types}
      />
    </Table>
  )
}

PayElements.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.instanceOf(Object).isRequired).isRequired,
  remove: PropTypes.func.isRequired,
  payElementTypes: PropTypes.arrayOf(
    PropTypes.instanceOf(PayElementType).isRequired
  ).isRequired,
}

export default PayElements
