import { useFormContext } from 'react-hook-form'

const ConfirmButton = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext()

  return (
    <button
      id="confirm-button"
      type="submit"
      disabled={isSubmitting}
      className="govuk-button lbh-button"
      data-module="govuk-button"
    >
      {isSubmitting ? <>Confirming ...</> : <>Confirm</>}
    </button>
  )
}

export default ConfirmButton
