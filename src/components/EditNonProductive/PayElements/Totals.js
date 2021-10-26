import PropTypes from 'prop-types'
import ColumnTotal from './ColumnTotal'
import GridTotal from './GridTotal'
import { TBody, TRow, TCell } from '@/components/Table'

const PayElementsTotals = ({ fields }) => {
  return (
    <TBody className="bc-pay-element-totals">
      <TRow>
        <td className="govuk-!-width-one-tenth">&nbsp;</td>
        <td className="govuk-table__header govuk-!-text-align-right">Totals</td>
        <TCell numeric={true}>
          <ColumnTotal fields={fields} weekday="monday" />
        </TCell>
        <TCell numeric={true}>
          <ColumnTotal fields={fields} weekday="tuesday" />
        </TCell>
        <TCell numeric={true}>
          <ColumnTotal fields={fields} weekday="wednesday" />
        </TCell>
        <TCell numeric={true}>
          <ColumnTotal fields={fields} weekday="thursday" />
        </TCell>
        <TCell numeric={true}>
          <ColumnTotal fields={fields} weekday="friday" />
        </TCell>
        <TCell numeric={true}>
          <ColumnTotal fields={fields} weekday="saturday" />
        </TCell>
        <TCell numeric={true}>
          <ColumnTotal fields={fields} weekday="sunday" />
        </TCell>
        <TCell numeric={true}>
          <GridTotal fields={fields} />
        </TCell>
        <td className="govuk-!-width-one-tenth">&nbsp;</td>
      </TRow>
    </TBody>
  )
}

PayElementsTotals.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.instanceOf(Object).isRequired).isRequired,
}

export default PayElementsTotals
