import PropTypes from 'prop-types'
import { useFormContext } from 'react-hook-form'

const IdField = ({ index }) => {
  const { register } = useFormContext()

  return <input type="hidden" {...register(`payElements.${index}.id`)} />
}

IdField.propTypes = {
  index: PropTypes.number.isRequired,
}

export default IdField
