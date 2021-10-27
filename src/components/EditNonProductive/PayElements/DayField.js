import PropTypes from 'prop-types'
import { useFormContext } from 'react-hook-form'
import { numberWithPrecision } from '@/utils/number'

const DayField = ({ index, weekday }) => {
  const { register } = useFormContext()

  const onBlur = (event) => {
    const number = parseFloat(event.target.value)

    if (!isNaN(number)) {
      event.target.value = numberWithPrecision(number, 2)
    }
  }

  return (
    <input
      type="text"
      className="govuk-input lbh-input govuk-!-text-align-right"
      {...register(`payElements.${index}.${weekday}`, {
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
