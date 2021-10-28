import { THead, TR, TH } from '@/components/Table'

const PayElementsHeader = () => {
  return (
    <THead className="bc-pay-element-head">
      <TR>
        <TH width="two-tenths" scope="col" colSpan="2">
          Pay element
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
  )
}

export default PayElementsHeader
