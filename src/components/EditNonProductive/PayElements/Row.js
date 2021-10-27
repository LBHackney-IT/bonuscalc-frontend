import PropTypes from 'prop-types'
import TypeField from './TypeField'
import DayField from './DayField'
import NoteField from './NoteField'
import TotalField from './TotalField'
import { TBody, TRow, TCell } from '@/components/Table'
import { PayElementType } from '@/models'

const PayElementsRow = ({ item, index, remove, payElementTypes }) => {
  const removePayElement = () => {
    remove(index)
  }

  return (
    <TBody className="bc-pay-element-row">
      <TRow>
        <TCell colSpan="2">
          <TypeField index={index} payElementTypes={payElementTypes} />
        </TCell>
        <TCell numeric={true}>
          <DayField index={index} weekday="monday" />
        </TCell>
        <TCell numeric={true}>
          <DayField index={index} weekday="tuesday" />
        </TCell>
        <TCell numeric={true}>
          <DayField index={index} weekday="wednesday" />
        </TCell>
        <TCell numeric={true}>
          <DayField index={index} weekday="thursday" />
        </TCell>
        <TCell numeric={true}>
          <DayField index={index} weekday="friday" />
        </TCell>
        <TCell numeric={true}>
          <DayField index={index} weekday="saturday" />
        </TCell>
        <TCell numeric={true}>
          <DayField index={index} weekday="sunday" />
        </TCell>
        <TCell numeric={true}>
          <TotalField index={index} />
        </TCell>
        <TCell>
          <button
            type="button"
            className="lbh-link govuk-!-font-size-16"
            onClick={removePayElement}
          >
            Remove
          </button>
        </TCell>
      </TRow>
      <TRow>
        <TCell colSpan="9">
          <NoteField item={item} index={index} />
        </TCell>
        <TCell>&nbsp;</TCell>
        <TCell>&nbsp;</TCell>
      </TRow>
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
