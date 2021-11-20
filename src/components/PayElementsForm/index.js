import PropTypes from 'prop-types'
import cx from 'classnames'
import AddAnotherButton from '@/components/AddAnotherButton'
import ButtonGroup from '@/components/ButtonGroup'
import ConfirmButton from '@/components/ConfirmButton'
import LinkButton from '@/components/LinkButton'
import PageContext from '@/components/PageContext'
import { Table, THead, TBody, TFoot } from '@/components/Table'
import { TR, TH, TD } from '@/components/Table'
import { PayElement } from '@/models'
import { numberWithPrecision, sum } from '@/utils/number'
import { calculateSMV } from '@/utils/scheme'
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

const IdField = ({ index }) => {
  const { register } = useFormContext()

  return <input type="hidden" {...register(`payElements.${index}.id`)} />
}

const TypeField = ({ index }) => {
  const { payElementTypes } = useContext(PageContext)
  const { register } = useFormContext()

  return (
    <select
      className="govuk-select lbh-select govuk-!-width-full"
      {...register(`payElements.${index}.payElementTypeId`, {
        valueAsNumber: true,
        required: true,
      })}
    >
      <option value="">-- Select Type --</option>
      {payElementTypes.map((payElementType) => (
        <option value={payElementType.id} key={payElementType.id}>
          {payElementType.description}
        </option>
      ))}
    </select>
  )
}

const NoteField = ({ item, index }) => {
  const [showNote, setShowNote] = useState(item.comment ? true : false)
  const [input, setInput] = useState()

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
        className={cx(showNote ? 'govuk-!-display-none' : null)}
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
        {...register(`payElements.${index}.comment`, { onBlur: onBlur })}
      />
    </>
  )
}

const DayField = ({ index, weekday, min, max }) => {
  const { register, setValue } = useFormContext()
  const fieldName = `payElements.${index}.${weekday}`

  const onBlur = (event) => {
    const value = event.target.value
    const number = parseFloat(value)

    if (!isNaN(number)) {
      event.target.value = numberWithPrecision(number, 2)
    } else if (!value) {
      event.target.value = '0.00'

      setTimeout(() => {
        setValue(fieldName, '0.00', { shouldDirty: true })
      }, 10)
    }
  }

  return (
    <input
      type="text"
      className="govuk-input lbh-input govuk-!-text-align-right"
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
}) => {
  const { operative, payElementTypes } = useContext(PageContext)
  const { register, watch, setValue } = useFormContext()
  const [total, setTotal] = useState(0)

  const watchType = watch(`payElements.${index}.payElementTypeId`)

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
    let value = 0

    if (watchType) {
      const payElementType = payElementTypes.find((pet) => pet.id == watchType)

      if (payElementType) {
        value = calculateSMV(operative, payElementType, duration)
      } else {
        value = 0
      }
    }

    setValue(`payElements.${index}.duration`, duration)
    setValue(`payElements.${index}.value`, value)
    setTotal(duration)
  }, [watchType, watchDays, index, setValue, operative, payElementTypes])

  return <>{numberWithPrecision(total, 2)}</>
}

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

const PayElementsForm = ({
  onSubmit,
  appendLabel,
  typeLabel,
  children,
  minDuration,
  maxDuration,
  minValue,
  maxValue,
  minDay,
  maxDay,
}) => {
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
      append(payElements.map((pe) => pe.toRow()))
      setInitialized(true)
    }
  }, [append, payElements, initialized])

  return (
    <form id="update-timesheet" onSubmit={handleSubmit(onSubmit)}>
      {errors.payElements ? <ErrorMessage /> : <></>}

      <Table id="pay-elements">
        <THead className="bc-pay-element-head">
          <TR>
            <TH width="two-tenths" scope="col" colSpan="2">
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
            <TH width="one-tenth" align="centre" scope="col">
              Total
            </TH>
            <TH width="one-tenth" scope="col">
              &nbsp;
            </TH>
          </TR>
        </THead>
        {fields.length > 0 ? (
          <>
            {fields.map((item, index) => (
              <TBody className="bc-pay-element-row" key={item.key}>
                <TR>
                  <TD colSpan="2">
                    <IdField index={index} />
                    <TypeField index={index} />
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
                    />
                  </TD>
                  <TD>
                    <LinkButton onClick={() => remove(index)}>
                      Remove
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
            <TFoot className="bc-pay-element-totals">
              <TR>
                <TH scope="row" colSpan="2" align="right">
                  Totals
                </TH>
                <TD numeric={true}>
                  <ColumnTotal fields={fields} weekday="monday" />
                </TD>
                <TD numeric={true}>
                  <ColumnTotal fields={fields} weekday="tuesday" />
                </TD>
                <TD numeric={true}>
                  <ColumnTotal fields={fields} weekday="wednesday" />
                </TD>
                <TD numeric={true}>
                  <ColumnTotal fields={fields} weekday="thursday" />
                </TD>
                <TD numeric={true}>
                  <ColumnTotal fields={fields} weekday="friday" />
                </TD>
                <TD numeric={true}>
                  <ColumnTotal fields={fields} weekday="saturday" />
                </TD>
                <TD numeric={true}>
                  <ColumnTotal fields={fields} weekday="sunday" />
                </TD>
                <TD numeric={true}>
                  <GridTotal fields={fields} />
                </TD>
                <TD width="one-tenth">&nbsp;</TD>
              </TR>
            </TFoot>
          </>
        ) : (
          <TBody>
            <TR>
              <TD colSpan="11">{children}</TD>
            </TR>
          </TBody>
        )}
      </Table>

      <ButtonGroup className="govuk-!-margin-top-9">
        <ConfirmButton disabled={isSubmitting}>
          {isSubmitting ? <>Confirming ...</> : <>Confirm</>}
        </ConfirmButton>

        <AddAnotherButton onClick={() => append(PayElement.defaultRow)}>
          {appendLabel}
        </AddAnotherButton>
      </ButtonGroup>
    </form>
  )
}

PayElementsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  appendLabel: PropTypes.string.isRequired,
  typeLabel: PropTypes.string,
  minDuration: PropTypes.number.isRequired,
  maxDuration: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  minDay: PropTypes.number.isRequired,
  maxDay: PropTypes.number.isRequired,
}

PayElementsForm.defaultProps = {
  typeLabel: 'Type',
}

export default PayElementsForm
