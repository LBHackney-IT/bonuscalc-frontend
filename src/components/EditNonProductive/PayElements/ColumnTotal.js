import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { numberWithPrecision, sum } from '@/utils/number'

const ColumnTotal = ({ fields, weekday }) => {
  const { watch } = useFormContext()
  const [total, setTotal] = useState(0)
  const watchColumn = watch(
    fields.map((item, index) => `payElements.${index}.${weekday}`)
  )

  useEffect(() => {
    setTotal(watchColumn.reduce(sum, 0))
  }, [watchColumn])

  return <>{numberWithPrecision(total, 2)}</>
}

ColumnTotal.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.instanceOf(Object).isRequired).isRequired,
  weekday: PropTypes.string.isRequired,
}

export default ColumnTotal
