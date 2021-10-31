import PropTypes from 'prop-types'
import PayElementsRow from './Row'
import PayElementsTotals from './Totals'
import { TBody, TR, TD } from '@/components/Table'

const PayElementsBody = ({ fields, remove }) => {
  return (
    <>
      {fields.length > 0 ? (
        <>
          {fields.map((item, index) => (
            <PayElementsRow
              key={item.id}
              item={item}
              index={index}
              remove={remove}
            />
          ))}
          <PayElementsTotals fields={fields} />
        </>
      ) : (
        <TBody>
          <TR>
            <TD colSpan="11">
              There are no non-productive items for this week.
            </TD>
          </TR>
        </TBody>
      )}
    </>
  )
}

PayElementsBody.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.instanceOf(Object).isRequired).isRequired,
  remove: PropTypes.func.isRequired,
}

export default PayElementsBody
