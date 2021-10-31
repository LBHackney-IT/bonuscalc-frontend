import PropTypes from 'prop-types'
import PageContext from '@/components/PageContext'
import { useEffect, useState, useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { numberWithPrecision, sum } from '@/utils/number'
import { calculateSMV } from '@/utils/scheme'

const TotalField = ({ index }) => {
  const { operative, payElementTypes } = useContext(PageContext)
  const { register, watch, setValue } = useFormContext()
  const [total, setTotal] = useState(0)

  const watchType = watch(`payElements.${index}.payElementTypeId`)

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
    min: 0,
  })

  useEffect(() => {
    const duration = watchDays.reduce(sum, 0)
    let value = 0

    if (watchType) {
      const payElementType = payElementTypes.find((pet) => pet.id == watchType)

      if (payElementType) {
        value = calculateSMV(operative, payElementType, duration)
      } else {
        value = 0
      }
    }

    setValue(`payElements.${index}.duration`, duration)
    setValue(`payElements.${index}.value`, value)
    setTotal(duration)
  }, [watchType, watchDays, index, setValue, operative, payElementTypes])

  return <>{numberWithPrecision(total, 2)}</>
}

TotalField.propTypes = {
  index: PropTypes.number.isRequired,
}

export default TotalField
