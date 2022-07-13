import Trade from './Trade'
import { bandForValue } from '@/utils/scheme'
import { transliterate } from '@/utils/string'

export default class OperativeSummary {
  constructor(attrs) {
    this.id = attrs.id
    this.name = attrs.name
    this.trade = new Trade(attrs.trade)
    this.schemeId = attrs.schemeId
    this.isArchived = attrs.isArchived
    this.productiveValue = attrs.productiveValue
    this.nonProductiveDuration = attrs.nonProductiveDuration
    this.nonProductiveValue = attrs.nonProductiveValue
    this.totalValue = attrs.totalValue
    this.utilisation = attrs.utilisation
    this.projectedValue = attrs.projectedValue
    this.averageUtilisation = attrs.averageUtilisation
    this.reportSentAt = attrs.reportSentAt
  }

  get description() {
    return `${this.name} (${this.id})`
  }

  get tradeCode() {
    return this.trade.id
  }

  get tradeDescription() {
    return `${this.trade.description} (${this.trade.id})`
  }

  get payBand() {
    return this.payBandFor(this.totalValue, this.utilisation)
  }

  get projectedPayBand() {
    return this.payBandFor(this.projectedValue, this.averageUtilisation)
  }

  payBandFor(value, utilisation) {
    return bandForValue(this.scheme.payBands, value, utilisation)
  }

  matches(pattern) {
    return (
      pattern.test(this.id) ||
      pattern.test(transliterate(this.name)) ||
      pattern.test(this.tradeDescription)
    )
  }
}
