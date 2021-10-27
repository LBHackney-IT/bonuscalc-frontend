import { THead, TRow, THeader } from '@/components/Table'

const PayElementsHeader = () => {
  return (
    <THead className="bc-pay-element-head">
      <TRow>
        <THeader width="two-tenths" scope="col" colSpan="2">
          Pay element
        </THeader>
        <THeader align="centre" scope="col">
          Mon
        </THeader>
        <THeader align="centre" scope="col">
          Tue
        </THeader>
        <THeader align="centre" scope="col">
          Wed
        </THeader>
        <THeader align="centre" scope="col">
          Thu
        </THeader>
        <THeader align="centre" scope="col">
          Fri
        </THeader>
        <THeader align="centre" scope="col">
          Sat
        </THeader>
        <THeader align="centre" scope="col">
          Sun
        </THeader>
        <THeader width="one-tenth" align="centre" scope="col">
          Total
        </THeader>
        <THeader width="one-tenth" scope="col">
          &nbsp;
        </THeader>
      </TRow>
    </THead>
  )
}

export default PayElementsHeader
