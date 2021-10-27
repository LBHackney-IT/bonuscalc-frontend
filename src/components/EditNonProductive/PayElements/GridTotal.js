import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { numberWithPrecision, sum } from '@/utils/number'

const GridTotal = ({ fields }) => {
  const { watch } = useFormContext()
  const [total, setTotal] = useState(0)

  const watchGrid = watch(
    fields
      .map((item, index) => {
        return [
          `payElements.${index}.monday`,
          `payElements.${index}.tuesday`,
          `payElements.${index}.wednesday`,
          `payElements.${index}.thursday`,
          `payElements.${index}.friday`,
          `payElements.${index}.saturday`,
          `payElements.${index}.sunday`,
        ]
      })
      .flat()
  )

  useEffect(() => {
    setTotal(watchGrid.reduce(sum, 0))
  }, [watchGrid])

  return <>{numberWithPrecision(total, 2)}</>
}

GridTotal.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.instanceOf(Object).isRequired).isRequired,
}

export default GridTotal
