import PropTypes from 'prop-types'

const AddPayElementButton = ({ append }) => {
  const defaults = {
    payElementTypeId: null,
    workOrder: null,
    address: null,
    comment: null,
    monday: '0.00',
    tuesday: '0.00',
    wednesday: '0.00',
    thursday: '0.00',
    friday: '0.00',
    saturday: '0.00',
    sunday: '0.00',
    duration: '0.00',
    value: '0.00',
  }

  const onClick = () => {
    append(defaults)
  }

  return (
    <button
      id="add-element-button"
      type="button"
      className="govuk-button lbh-button lbh-button--add"
      data-module="govuk-button"
      onClick={onClick}
    >
      <svg width="12" height="12" viewBox="0 0 12 12">
        <path d="M6.94 0L5 0V12H6.94V0Z" />
        <path d="M12 5H0V7H12V5Z" />
      </svg>
      Add pay element
    </button>
  )
}

AddPayElementButton.propTypes = {
  append: PropTypes.func.isRequired,
}

export default AddPayElementButton
