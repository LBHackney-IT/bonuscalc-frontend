import PropTypes from 'prop-types'
import PageContext from '@/components/PageContext'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { compareStrings } from '@/utils/string'

const TypeField = ({ index }) => {
  const { payElementTypes } = useContext(PageContext)
  const { register } = useFormContext()

  const nonProductiveTypes = payElementTypes
    .filter((pet) => pet.nonProductive && pet.selectable)
    .sort((a, b) => compareStrings(a.description, b.description))

  return (
    <select
      className="govuk-select lbh-select govuk-!-width-full"
      {...register(`payElements.${index}.payElementTypeId`, {
        valueAsNumber: true,
        required: true,
      })}
    >
      <option value="">-- Select Type --</option>
      {nonProductiveTypes.map((payElementType, index) => (
        <option value={payElementType.id} key={index}>
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
