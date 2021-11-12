import PropTypes from 'prop-types'
import PageContext from '@/components/PageContext'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'

const TypeField = ({ index }) => {
  const { payElementTypes } = useContext(PageContext)
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
      {payElementTypes.map((payElementType) => (
        <option value={payElementType.id} key={payElementType.id}>
          {payElementType.description}
        </option>
      ))}
    </select>
  )
}

TypeField.propTypes = {
  index: PropTypes.number.isRequired,
}

export default TypeField
