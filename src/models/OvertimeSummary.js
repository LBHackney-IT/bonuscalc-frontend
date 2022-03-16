import Trade from './Trade'

export default class OvertimeSummary {
  constructor(attrs) {
    this.id = attrs.id
    this.name = attrs.name
    this.trade = new Trade(attrs.trade)
    this.costCode = attrs.costCode
    this.totalValue = attrs.totalValue
  }

  get tradeDescription() {
    return `${this.trade.description} (${this.trade.id})`
  }
}
