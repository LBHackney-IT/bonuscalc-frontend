import Trade from './Trade'

export default class OperativeSummary {
  constructor(attrs) {
    this.id = attrs.id
    this.name = attrs.name
    this.trade = new Trade(attrs.trade)
    this.schemeId = attrs.schemeId
    this.productiveValue = attrs.productiveValue
    this.nonProductiveDuration = attrs.nonProductiveDuration
    this.nonProductiveValue = attrs.nonProductiveValue
    this.totalValue = attrs.totalValue
    this.utilisation = attrs.utilisation
    this.projectedValue = attrs.projectedValue
    this.averageUtilisation = attrs.averageUtilisation
  }

  get description() {
    return `${this.name} (${this.id})`
  }

  get tradeDescription() {
    return `${this.trade.description} (${this.trade.id})`
  }
}
