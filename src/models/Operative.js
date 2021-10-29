import Scheme from './Scheme'
import Trade from './Trade'

export default class Operative {
  constructor(attrs) {
    this.id = attrs.id
    this.name = attrs.name
    this.section = attrs.section
    this.scheme = attrs.scheme ? new Scheme(attrs.scheme) : null
    this.salaryBand = attrs.salaryBand
    this.fixedBand = attrs.fixedBand
    this.trade = new Trade(attrs.trade)
  }

  get tradeDescription() {
    return `${this.trade.description} (${this.trade.id})`
  }

  get schemeType() {
    return this.scheme?.type
  }
}
