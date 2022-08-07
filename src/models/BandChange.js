import BandApprover from './BandApprover'
import BonusPeriod from './BonusPeriod'
import WeeklySummary from './WeeklySummary'
import { transliterate } from '@/utils/string'

const TRADE_PATTERN = /^([^(]+)\s+\(([^)]+)\)$/i
const SICK_WARNING = 36.0

export default class BandChange {
  constructor(attrs) {
    this.id = attrs.id
    this.operativeId = attrs.operativeId
    this.operativeName = attrs.operativeName
    this.emailAddress = attrs.emailAddress
    this.bonusPeriod = new BonusPeriod(attrs.bonusPeriod)
    this.trade = attrs.trade
    this.scheme = attrs.scheme
    this.bandValue = attrs.bandValue
    this.maxValue = attrs.maxValue
    this.sickDuration = attrs.sickDuration
    this.totalValue = attrs.totalValue
    this.utilisation = attrs.utilisation
    this.fixedBand = attrs.fixedBand
    this.salaryBand = attrs.salaryBand
    this.projectedBand = attrs.projectedBand
    this.finalBand = attrs.finalBand
    this.supervisor = new BandApprover(attrs.supervisor)
    this.manager = new BandApprover(attrs.manager)
    this.reportSentAt = attrs.reportSentAt
    this.weeklySummaries = attrs.weeklySummaries?.map(
      (ws) => new WeeklySummary(ws)
    )
  }

  get tradeCode() {
    return this.trade.replace(TRADE_PATTERN, '$2')
  }

  get tradeDescription() {
    return this.trade.replace(TRADE_PATTERN, '$1')
  }

  get isFixedBand() {
    return this.fixedBand
  }

  get isBonusBand() {
    return !this.isFixedBand
  }

  get isSickWarning() {
    return this.sickDuration >= SICK_WARNING
  }

  get isSupervisorApproved() {
    return this.supervisor?.decision == 'Approved'
  }

  get isSupervisorRejected() {
    return this.supervisor?.decision == 'Rejected'
  }

  get hasSupervisorDecision() {
    return this.supervisor?.decision ? true : false
  }

  get supervisorBand() {
    return this.supervisor?.salaryBand
  }

  get supervisorReason() {
    return this.supervisor?.reason
  }

  get managerReason() {
    return this.manager?.reason
  }

  get managerBand() {
    return this.manager?.salaryBand
  }

  get isManagerApproved() {
    return this.manager?.decision == 'Approved'
  }

  get isManagerRejected() {
    return this.manager?.decision == 'Rejected'
  }

  get isPending() {
    return this.finalBand ? false : true
  }

  get isCompleted() {
    return !this.isPending
  }

  get hasBeenSent() {
    return this.reportSentAt ? true : false
  }

  get closedWeeklySummaries() {
    return this.weeklySummaries.filter((ws) => ws.isClosed)
  }

  get lastClosedWeeklySummary() {
    return this.closedWeeklySummaries[this.closedWeeklySummaries.length - 1]
  }

  get hasClosedWeeklySummaries() {
    return this.closedWeeklySummaries.length > 0
  }

  get totalClosedProductiveValue() {
    return this.closedWeeklySummaries.reduce((sum, ws) => {
      return sum + ws.productiveValue
    }, 0)
  }

  get totalClosedNonProductiveValue() {
    return this.closedWeeklySummaries.reduce((sum, ws) => {
      return sum + ws.nonProductiveValue
    }, 0)
  }

  get totalClosedNonProductiveDuration() {
    return this.closedWeeklySummaries.reduce((sum, ws) => {
      return sum + ws.nonProductiveDuration
    }, 0)
  }

  get totalClosedValueForBonusPeriod() {
    return this.closedWeeklySummaries.reduce((sum, ws) => {
      return sum + ws.totalValue
    }, 0)
  }

  get projectedClosedValue() {
    return this.closedWeeklySummaries.reduce((projected, ws) => {
      return ws.projectedValue
    }, 0)
  }

  get averageClosedUtilisation() {
    return this.closedWeeklySummaries.reduce((average, ws) => {
      return ws.averageUtilisation
    }, 1)
  }

  get approver() {
    return this.manager.decision == 'Rejected' ? this.manager : this.supervisor
  }

  get decision() {
    return this.approver.decision
  }

  get decisionOn() {
    return this.approver.date
  }

  get decisionBy() {
    return this.approver.name
  }

  get reason() {
    return this.approver.reason
  }

  get changedTo() {
    if (this.isCompleted) {
      return this.finalBand == this.salaryBand
        ? 'No change'
        : `Band ${this.finalBand}`
    } else {
      return '–'
    }
  }

  matches(pattern) {
    return (
      pattern.test(this.operativeId) ||
      pattern.test(transliterate(this.operativeName)) ||
      pattern.test(this.trade)
    )
  }
}
