import PropTypes from 'prop-types'
import { useFormContext } from 'react-hook-form'
import { PayElementType } from '@/models'

const TypeField = ({ index, payElementTypes }) => {
  const { register } = useFormContext()

  return (
    <select
      className="govuk-select lbh-select govuk-!-width-full"
      {...register(`payElements.${index}.payElementTypeId`, {
        valueAsNumber: true,
        required: true,
      })}
    >
      <option value="">-- Select Type --</option>
      {payElementTypes.map((payElementType, index) => (
        <option value={payElementType.id} key={index}>
          {payElementType.description}
        </option>
      ))}
    </select>
  )
}

TypeField.propTypes = {
  index: PropTypes.number.isRequired,
  payElementTypes: PropTypes.arrayOf(
    PropTypes.instanceOf(PayElementType).isRequired
  ).isRequired,
}

export default TypeField
