import PropTypes from 'prop-types'
import { useFormContext } from 'react-hook-form'
import { numberWithPrecision } from '@/utils/number'

const DayField = ({ index, weekday }) => {
  const { register, setValue } = useFormContext()
  const fieldName = `payElements.${index}.${weekday}`

  const onBlur = (event) => {
    const value = event.target.value
    const number = parseFloat(value)

    if (!isNaN(number)) {
      event.target.value = numberWithPrecision(number, 2)
    } else if (!value) {
      event.target.value = '0.00'

      setTimeout(() => {
        setValue(fieldName, '0.00', { shouldDirty: true })
      }, 10)
    }
  }

  return (
    <input
      type="text"
      className="govuk-input lbh-input govuk-!-text-align-right"
      {...register(fieldName, {
        onBlur: onBlur,
        valueAsNumber: true,
        required: true,
        min: 0,
        max: 24,
        validate: {
          isNumber: (v) => !isNaN(v),
        },
      })}
    />
  )
}

DayField.propTypes = {
  index: PropTypes.number.isRequired,
  weekday: PropTypes.string.isRequired,
}

export default DayField
