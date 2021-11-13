import PropTypes from 'prop-types'
import Button from '@/components/Button'

const AddAnotherButton = ({ onClick, children, ...props }) => (
  <Button className="lbh-button--add" onClick={onClick} {...props}>
    <svg width="12" height="12" viewBox="0 0 12 12">
      <path d="M6.94 0L5 0V12H6.94V0Z" />
      <path d="M12 5H0V7H12V5Z" />
    </svg>
    {children}
  </Button>
)

AddAnotherButton.propTypes = {
  onClick: PropTypes.func,
}

export default AddAnotherButton
