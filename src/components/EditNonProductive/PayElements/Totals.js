import PropTypes from 'prop-types'
import ColumnTotal from './ColumnTotal'
import GridTotal from './GridTotal'
import { TBody, TR, TD } from '@/components/Table'

const PayElementsTotals = ({ fields }) => {
  return (
    <TBody className="bc-pay-element-totals">
      <TR>
        <td className="govuk-!-width-one-tenth">&nbsp;</td>
        <td className="govuk-table__header govuk-!-text-align-right">Totals</td>
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
        <td className="govuk-!-width-one-tenth">&nbsp;</td>
      </TR>
    </TBody>
  )
}

PayElementsTotals.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.instanceOf(Object).isRequired).isRequired,
}

export default PayElementsTotals
