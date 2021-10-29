import PropTypes from 'prop-types'
import ColumnTotal from './ColumnTotal'
import GridTotal from './GridTotal'
import { TFoot, TR, TH, TD } from '@/components/Table'

const PayElementsTotals = ({ fields }) => {
  return (
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
  )
}

PayElementsTotals.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.instanceOf(Object).isRequired).isRequired,
}

export default PayElementsTotals
