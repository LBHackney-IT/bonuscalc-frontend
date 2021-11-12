import PropTypes from 'prop-types'
import Button from '@/components/Button'

const ConfirmButton = ({ id, disabled, children, ...props }) => (
  <Button id={id} type="submit" disabled={disabled} {...props}>
    {children}
  </Button>
)

ConfirmButton.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
}

ConfirmButton.defaultProps = {
  id: 'confirm-button',
}

export default ConfirmButton
