import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { operativeExists } from '../../utils/apiClient'
import cx from 'classnames'

const OperativeSearch = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ reValidateMode: 'onSubmit' })
  const router = useRouter()

  const onSubmit = (data) => {
    router.push(`/operatives/${data.payrollNumber}`)
  }

  return (
    <>
      <h1 className="lbh-heading-h1">Find operative</h1>
      <form id="operative-search" onSubmit={handleSubmit(onSubmit)}>
        <div
          className={cx('govuk-form-group lbh-form-group', {
            'govuk-form-group--error': errors.payrollNumber,
          })}
        >
          <label className="govuk-label lbh-label" htmlFor="payroll-number">
            Search by full payroll number
          </label>
          <span id="payroll-number-hint" className="govuk-hint lbh-hint">
            Payroll number must be 6 digits (e.g. 123456)
          </span>
          {errors.payrollNumber && errors.payrollNumber.type === 'required' && (
            <span className="govuk-error-message lbh-error-message">
              <span className="govuk-visually-hidden">Error:</span> Enter a
              payroll number
            </span>
          )}
          {errors.payrollNumber && errors.payrollNumber.type === 'pattern' && (
            <span className="govuk-error-message lbh-error-message">
              <span className="govuk-visually-hidden">Error:</span> Invalid
              payroll number
            </span>
          )}
          {errors.payrollNumber && errors.payrollNumber.type === 'exists' && (
            <span className="govuk-error-message lbh-error-message">
              <span className="govuk-visually-hidden">Error:</span> Operative
              not found
            </span>
          )}
          <input
            {...register('payrollNumber', {
              required: true,
              pattern: /^\d{6}$/,
              validate: {
                exists: async (value) => await operativeExists(value),
              },
            })}
            id="payroll-number"
            className="govuk-input lbh-input govuk-!-width-one-quarter"
          />
        </div>
        <button
          id="search-button"
          type="submit"
          className="govuk-button lbh-button"
          data-module="govuk-button"
        >
          Search
        </button>
      </form>
    </>
  )
}

export default OperativeSearch
