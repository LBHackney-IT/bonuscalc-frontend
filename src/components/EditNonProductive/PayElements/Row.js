import PropTypes from 'prop-types'
import TypeField from './TypeField'
import DayField from './DayField'
import NoteField from './NoteField'
import TotalField from './TotalField'
import { TBody, TR, TD } from '@/components/Table'
import { PayElementType } from '@/models'

const PayElementsRow = ({ item, index, remove, payElementTypes }) => {
  const removePayElement = () => {
    remove(index)
  }

  return (
    <TBody className="bc-pay-element-row">
      <TR>
        <TD colSpan="2">
          <TypeField index={index} payElementTypes={payElementTypes} />
        </TD>
        <TD numeric={true}>
          <DayField index={index} weekday="monday" />
        </TD>
        <TD numeric={true}>
          <DayField index={index} weekday="tuesday" />
        </TD>
        <TD numeric={true}>
          <DayField index={index} weekday="wednesday" />
        </TD>
        <TD numeric={true}>
          <DayField index={index} weekday="thursday" />
        </TD>
        <TD numeric={true}>
          <DayField index={index} weekday="friday" />
        </TD>
        <TD numeric={true}>
          <DayField index={index} weekday="saturday" />
        </TD>
        <TD numeric={true}>
          <DayField index={index} weekday="sunday" />
        </TD>
        <TD numeric={true}>
          <TotalField index={index} />
        </TD>
        <TD>
          <button
            type="button"
            className="lbh-link govuk-!-font-size-16"
            onClick={removePayElement}
          >
            Remove
          </button>
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
  )
}

PayElementsRow.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
  payElementTypes: PropTypes.arrayOf(
    PropTypes.instanceOf(PayElementType).isRequired
  ).isRequired,
}

export default PayElementsRow
