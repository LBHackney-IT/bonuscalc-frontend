import PropTypes from 'prop-types'
import cx from 'classnames'
import LinkButton from '@/components/LinkButton'
import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

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

NoteField.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
}

export default NoteField
