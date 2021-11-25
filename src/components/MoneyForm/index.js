import PropTypes from 'prop-types'
import cx from 'classnames'
import ButtonGroup from '@/components/ButtonGroup'
import ButtonLink from '@/components/ButtonLink'
import ConfirmButton from '@/components/ConfirmButton'
import LinkButton from '@/components/LinkButton'
import PageContext from '@/components/PageContext'
import { Table, THead, TBody } from '@/components/Table'
import { TR, TH, TD } from '@/components/Table'
import { PayElement } from '@/models'
import { numberWithPrecision, sum } from '@/utils/number'
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

const NoteField = ({ item, index }) => {
  const [showNote, setShowNote] = useState(item.comment ? true : false)
  const [input, setInput] = useState()
  const fieldName = `payElements.${index}.comment`

  const { register } = useFormContext()

  const onBlur = (event) => {
    if (!event.target.value) {
      setShowNote(false)
    }
  }

  const addNote = (event) => {
    setInput(event.target.nextElementSibling)
    setShowNote(true)
  }

  useEffect(() => {
    if (input) input.focus()
  }, [showNote, input])

  return (
    <>
      <LinkButton
        className={cx(
          'govuk-!-font-size-16',
          showNote ? 'govuk-!-display-none' : null
        )}
        onClick={addNote}
      >
        Add note
      </LinkButton>
      <input
        type="text"
        className={cx(
          'govuk-input lbh-input',
          showNote ? null : 'govuk-!-display-none'
        )}
        {...register(fieldName, { onBlur: onBlur })}
      />
    </>
  )
}

const DayField = ({ index, weekday, min, max }) => {
  const { register, setValue } = useFormContext()
  const fieldName = `payElements.${index}.${weekday}`

  const onBlur = (event) => {
    const value = event.target.value
    const number = parseInt(value)

    if (!isNaN(number)) {
      event.target.value = numberWithPrecision(number, 0)
    } else if (!value) {
      event.target.value = '0'

      setTimeout(() => {
        setValue(fieldName, '0', { shouldDirty: true })
      }, 10)
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
        min: min,
        max: max,
        validate: {
          isNumber: (v) => !isNaN(v),
        },
      })}
    />
  )
}

const TotalField = ({
  index,
  minDuration,
  maxDuration,
  minValue,
  maxValue,
  rate,
}) => {
  const { register, watch, setValue } = useFormContext()
  const [total, setTotal] = useState(0)

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
    min: minDuration,
    max: maxDuration,
  })

  register(`payElements.${index}.value`, {
    valueAsNumber: true,
    min: minValue,
    max: maxValue,
  })

  useEffect(() => {
    const duration = watchDays.reduce(sum, 0)
    const value = duration * rate

    setValue(`payElements.${index}.duration`, duration)
    setValue(`payElements.${index}.value`, value)
    setTotal(duration)
  }, [watchDays, index, setValue, rate])

  return <>{numberWithPrecision(total, 0)}</>
}

const MoneyForm = ({
  onSubmit,
  cancelUrl,
  typeLabel,
  minDuration,
  maxDuration,
  minValue,
  maxValue,
  minDay,
  maxDay,
  rate,
}) => {
  const { timesheet, payElements } = useContext(PageContext)
  const { setValue } = useFormContext()
  const { week } = timesheet
  const [initialized, setInitialized] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormContext()

  register('id', { value: timesheet.id })

  const { fields, append } = useFieldArray({
    control,
    name: 'payElements',
    keyName: 'key',
  })

  const clearAll = (index) => {
    const baseName = `payElements.${index}`

    PayElement.days.forEach((day) => {
      setValue(`${baseName}.${day}`, 0, { shouldDirty: true })
    })

    setValue(`${baseName}.duration`, 0, { shouldDirty: true })
    setValue(`${baseName}.value`, 0, { shouldDirty: true })
  }

  useEffect(() => {
    if (!initialized) {
      append(payElements.map((pe) => pe.toRow(0)))
      setInitialized(true)
    }
  }, [append, payElements, initialized])

  return (
    <form id="update-timesheet" onSubmit={handleSubmit(onSubmit)}>
      {errors.payElements ? <ErrorMessage /> : <></>}

      <Table id="pay-elements">
        <THead className="bc-pay-element-head">
          <TR>
            <TH scope="col" colSpan="2">
              {typeLabel}
            </TH>
            <TH align="centre" scope="col">
              Mon
            </TH>
            <TH align="centre" scope="col">
              Tue
            </TH>
            <TH align="centre" scope="col">
              Wed
            </TH>
            <TH align="centre" scope="col">
              Thu
            </TH>
            <TH align="centre" scope="col">
              Fri
            </TH>
            <TH align="centre" scope="col">
              Sat
            </TH>
            <TH align="centre" scope="col">
              Sun
            </TH>
            <TH align="centre" scope="col">
              Total
            </TH>
            <TH scope="col">&nbsp;</TH>
          </TR>
        </THead>
        {fields.map((item, index) => (
          <TBody className="bc-pay-element-row" key={item.key}>
            <TR>
              <TD colSpan="2">
                <HiddenField name="id" index={index} />
                <HiddenField name="payElementTypeId" index={index} />
                {week.dateRange}
              </TD>
              <TD numeric={true}>
                <DayField
                  index={index}
                  weekday="monday"
                  min={minDay}
                  max={maxDay}
                />
              </TD>
              <TD numeric={true}>
                <DayField
                  index={index}
                  weekday="tuesday"
                  min={minDay}
                  max={maxDay}
                />
              </TD>
              <TD numeric={true}>
                <DayField
                  index={index}
                  weekday="wednesday"
                  min={minDay}
                  max={maxDay}
                />
              </TD>
              <TD numeric={true}>
                <DayField
                  index={index}
                  weekday="thursday"
                  min={minDay}
                  max={maxDay}
                />
              </TD>
              <TD numeric={true}>
                <DayField
                  index={index}
                  weekday="friday"
                  min={minDay}
                  max={maxDay}
                />
              </TD>
              <TD numeric={true}>
                <DayField
                  index={index}
                  weekday="saturday"
                  min={minDay}
                  max={maxDay}
                />
              </TD>
              <TD numeric={true}>
                <DayField
                  index={index}
                  weekday="sunday"
                  min={minDay}
                  max={maxDay}
                />
              </TD>
              <TD numeric={true}>
                <TotalField
                  index={index}
                  minDuration={minDuration}
                  maxDuration={maxDuration}
                  minValue={minValue}
                  maxValue={maxValue}
                  rate={rate}
                />
              </TD>
              <TD>
                <LinkButton onClick={() => clearAll(index)}>
                  Clear all
                </LinkButton>
              </TD>
            </TR>
            <TR>
              <TD colSpan="9">
                <NoteField item={item} index={index} />
              </TD>
              <TD>&nbsp;</TD>
              <TD>&nbsp;</TD>
            </TR>
          </TBody>
        ))}
      </Table>
      <ButtonGroup className="govuk-!-margin-top-9">
        <ConfirmButton disabled={isSubmitting}>
          {isSubmitting ? <>Confirming ...</> : <>Confirm</>}
        </ConfirmButton>

        <ButtonLink href={cancelUrl} secondary={true}>
          Cancel
        </ButtonLink>
      </ButtonGroup>
    </form>
  )
}

MoneyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancelUrl: PropTypes.string.isRequired,
  typeLabel: PropTypes.string,
  minDuration: PropTypes.number.isRequired,
  maxDuration: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  minDay: PropTypes.number.isRequired,
  maxDay: PropTypes.number.isRequired,
  rate: PropTypes.number.isRequired,
}

export default MoneyForm
