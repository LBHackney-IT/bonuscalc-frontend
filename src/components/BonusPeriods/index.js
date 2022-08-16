import PropTypes from 'prop-types'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import { useRef } from 'react'
import { Table, THead, TBody, TR, TH, TD } from '@/components/Table'
import { BonusPeriod } from '@/models'
import { createBonusPeriod } from '@/utils/apiClient'

const BonusPeriods = ({ periods }) => {
  const createButton = useRef(null)

  const isDisabled = () => {
    return periods.filter((bp) => bp.isOpen).length > 1
  }

  const onClick = async () => {
    createButton.current.disabled = true
    await createBonusPeriod(periods.at(-1).nextDate)
    createButton.current.disabled = false
  }

  return (
    <section className="bc-bonus-periods">
      <header>
        <h2>Bonus periods</h2>
      </header>

      <Table className="govuk-!-margin-top-3">
        <THead>
          <TR>
            <TH>Period</TH>
            <TH>Date</TH>
            <TH>Closed</TH>
          </TR>
        </THead>
        <TBody>
          {periods.map((bp, index) => (
            <TR key={index}>
              <TD>{bp.description}</TD>
              <TD>{bp.dateRange}</TD>
              <TD>{bp.closedDate}</TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <ButtonGroup>
        <Button ref={createButton} disabled={isDisabled()} onClick={onClick}>
          Create Period
        </Button>
      </ButtonGroup>
    </section>
  )
}

BonusPeriods.propTypes = {
  periods: PropTypes.arrayOf(PropTypes.instanceOf(BonusPeriod)).isRequired,
}

export default BonusPeriods
