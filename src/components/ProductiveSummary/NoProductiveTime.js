import PageContext from '@/components/PageContext'
import { useContext } from 'react'
import { Table, THead, TBody, TR, TH, TD } from '@/components/Table'

const NoProductiveTime = () => {
  const {
    operative: { isUnitScheme },
  } = useContext(PageContext)

  return (
    <Table id="productive-summary">
      <THead>
        <TR>
          <TH scope="col" width="two-tenths">
            Reference
          </TH>
          <TH scope="col" width="three-tenths">
            Address
          </TH>
          <TH scope="col" width="four-tenths">
            Description
          </TH>
          <TH scope="col" width="one-tenth" numeric={true}>
            {isUnitScheme ? 'Units' : 'SMVh'}
          </TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD colSpan="4">There are no productive items for this week.</TD>
        </TR>
      </TBody>
    </Table>
  )
}

export default NoProductiveTime
