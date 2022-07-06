import { transliterate } from '@/utils/string'

const TRADE_PATTERN = /^([^(]+)\s+\(([^)]+)\)$/i
const SICK_WARNING = 36.0

export default class OperativeProjection {
  constructor(attrs) {
    this.id = attrs.id
    this.operativeId = attrs.operativeId
    this.operativeName = attrs.operativeName
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
    this.supervisorName = attrs.supervisorName
    this.supervisorEmailAddress = attrs.supervisorEmailAddress
    this.managerName = attrs.managerName
    this.managerEmailAddress = attrs.managerEmailAddress
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

  matches(pattern) {
    return (
      pattern.test(this.operativeId) ||
      pattern.test(transliterate(this.operativeName)) ||
      pattern.test(this.trade)
    )
  }
}
