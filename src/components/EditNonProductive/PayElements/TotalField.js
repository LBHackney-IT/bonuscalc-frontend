import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { numberWithPrecision, sum } from '@/utils/number'

const TotalField = ({ index }) => {
  const { register, watch, setValue } = useFormContext()
  const [total, setTotal] = useState(0)

  const watchDays = watch([
    `payElements.${index}.monday`,
    `payElements.${index}.tuesday`,
    `payElements.${index}.wednesday`,
    `payElements.${index}.thursday`,
    `payElements.${index}.friday`,
    `payElements.${index}.saturday`,
    `payElements.${index}.sunday`,
  ])

  register(`payElements.${index}.duration`, {
    valueAsNumber: true,
    required: true,
    min: 0.01,
    max: 168,
  })

  register(`payElements.${index}.value`, {
    valueAsNumber: true,
    required: true,
  })

  useEffect(() => {
    const duration = watchDays.reduce(sum, 0)
    const value = duration * 60

    setValue(`payElements.${index}.duration`, duration)
    setValue(`payElements.${index}.value`, value)
    setTotal(duration)
  }, [watchDays, index, setValue])

  return <>{numberWithPrecision(total, 2)}</>
}

TotalField.propTypes = {
  index: PropTypes.number.isRequired,
}

export default TotalField
