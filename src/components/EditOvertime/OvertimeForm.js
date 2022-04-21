import PropTypes from 'prop-types'
import AddAnotherButton from '@/components/AddAnotherButton'
import ButtonGroup from '@/components/ButtonGroup'
import ConfirmButton from '@/components/ConfirmButton'
import LinkButton from '@/components/LinkButton'
import PageContext from '@/components/PageContext'
import { Table, THead, TBody, TFoot } from '@/components/Table'
import { TR, TH, TD } from '@/components/Table'
import { PayElement } from '@/models'
import { numberWithPrecision, round, sum } from '@/utils/number'
import { humanize } from '@/utils/string'
import { useEffect, useContext, useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'

const ErrorMessage = () => (
  <p className="lbh-body-m">
    <span className="govuk-error-message lbh-error-message">
      <span className="govuk-visually-hidden">Error:</span> There are errors in
      the form - please ensure you have entered the details correctly.
    </span>
  </p>
)

const HiddenField = ({ name, index }) => {
  const { register } = useFormContext()
  const fieldName = `payElements.${index}.${name}`

  return <input type="hidden" {...register(fieldName)} />
}

const WeekdayField = ({ item, index, rate }) => {
  const firstDay = PayElement.days.find((day) => item[day] > 0) || 'monday'
  const [weekday, setWeekday] = useState(firstDay)
  const { register, watch, setValue } = useFormContext()

  PayElement.days.forEach((day) => {
    register(`payElements.${index}.${day}`, {
      valueAsNumber: true,
    })
  })

  register(`payElements.${index}.value`, {
    valueAsNumber: true,
  })

  const watchDuration = watch(`payElements.${index}.duration`)

  const onChange = (event) => {
    setWeekday(event.target.value)
  }

  useEffect(() => {
    PayElement.days.forEach((day) => {
      setValue(`payElements.${index}.${day}`, '0.00')
    })

    setValue(`payElements.${index}.${weekday}`, watchDuration)
    setValue(`payElements.${index}.value`, round(watchDuration * rate, 2))
  }, [weekday, watchDuration, index, setValue, rate])

  return (
    <select
      className="govuk-select lbh-select govuk-!-width-full"
      defaultValue={weekday}
      onChange={onChange}
    >
      {PayElement.days.map((day) => (
        <option value={day} key={day}>
          {humanize(day)}
        </option>
      ))}
    </select>
  )
}

const AddressField = ({ index }) => {
  const fieldName = `payElements.${index}.comment`
  const { register } = useFormContext()

  return (
    <input
      type="text"
      className="govuk-input lbh-input"
      {...register(fieldName, { required: true })}
    />
  )
}

const DurationField = ({ index }) => {
  const { register } = useFormContext()
  const fieldName = `payElements.${index}.duration`

  const onBlur = (event) => {
    const value = event.target.value
    const number = parseFloat(value)

    if (!isNaN(number)) {
      event.target.value = numberWithPrecision(number, 2)
    } else if (!value) {
      event.target.value = '0.00'
    }
  }

  const selectAll = (event) => {
    const input = event.target

    input.selectionStart = 0
    input.selectionEnd = input.value.length
  }

  return (
    <input
      type="text"
      className="govuk-input lbh-input govuk-!-text-align-right"
      onClick={selectAll}
      {...register(fieldName, {
        onBlur: onBlur,
        valueAsNumber: true,
        required: true,
        min: 1,
        max: 24,
        validate: {
          isNumber: (v) => !isNaN(v),
        },
      })}
    />
  )
}

const OvertimeTotal = ({ fields }) => {
  const { watch } = useFormContext()
  const [total, setTotal] = useState(0)
  const watchDuration = watch(
    fields.map((item, index) => `payElements.${index}.duration`)
  )

  useEffect(() => {
    setTotal(watchDuration.reduce(sum, 0))
  }, [watchDuration])

  return <>{numberWithPrecision(total, 2)}</>
}

const OvertimeForm = ({ onSubmit, appendLabel, children, rate }) => {
  const { timesheet, payElements } = useContext(PageContext)
  const [initialized, setInitialized] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormContext()

  register('id', { value: timesheet.id })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'payElements',
    keyName: 'key',
  })

  useEffect(() => {
    if (!initialized) {
      append(payElements.map((pe) => pe.toRow(2)))
      setInitialized(true)
    }
  }, [append, payElements, initialized])

  return (
    <form id="update-timesheet" onSubmit={handleSubmit(onSubmit)}>
      {errors.payElements ? <ErrorMessage /> : <></>}

      <Table id="overtime-elements" className="bc-edit-overtime-elements">
        <THead className="bc-overtime-head">
          <TR>
            <TH width="two-tenths" scope="col">
              Day
            </TH>
            <TH width="six-tenths" scope="col">
              Address
            </TH>
            <TH width="one-tenth" align="centre" scope="col">
              Hours
            </TH>
            <TH width="one-tenth" align="right" scope="col">
              &nbsp;
            </TH>
          </TR>
        </THead>
        {fields.length > 0 ? (
          <>
            {fields.map((item, index) => (
              <TBody key={item.key} className="bc-overtime-row">
                <TR>
                  <TD>
                    <HiddenField name="id" index={index} />
                    <HiddenField name="payElementTypeId" index={index} />
                    <WeekdayField item={item} index={index} rate={rate} />
                  </TD>
                  <TD>
                    <AddressField index={index} />
                  </TD>
                  <TD numeric={true}>
                    <DurationField index={index} />
                  </TD>
                  <TD align="right">
                    <LinkButton onClick={() => remove(index)}>
                      Remove
                    </LinkButton>
                  </TD>
                </TR>
              </TBody>
            ))}
            <TFoot className="bc-overtime-totals">
              <TR>
                <TH scope="row" colSpan="2" align="right">
                  Total
                </TH>
                <TD numeric={true}>
                  <OvertimeTotal fields={fields} />
                </TD>
                <TD align="right">&nbsp;</TD>
              </TR>
            </TFoot>
          </>
        ) : (
          <TBody>
            <TR>
              <TD colSpan="4">{children}</TD>
            </TR>
          </TBody>
        )}
      </Table>

      <ButtonGroup className="govuk-!-margin-top-9">
        <ConfirmButton disabled={isSubmitting}>
          {isSubmitting ? <>Confirming ...</> : <>Confirm</>}
        </ConfirmButton>

        <AddAnotherButton
          onClick={() => append(PayElement.overtimeHours.toRow(2))}
        >
          {appendLabel}
        </AddAnotherButton>
      </ButtonGroup>
    </form>
  )
}

OvertimeForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  appendLabel: PropTypes.string.isRequired,
}

export default OvertimeForm
