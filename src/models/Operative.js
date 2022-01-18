import Scheme from './Scheme'
import Trade from './Trade'

export default class Operative {
  constructor(attrs) {
    this.id = attrs.id
    this.name = attrs.name
    this.section = attrs.section
    this.scheme = attrs.scheme ? new Scheme(attrs.scheme) : null
    this.salaryBand = attrs.salaryBand
    this.utilisation = attrs.utilisation
    this.fixedBand = attrs.fixedBand
    this.trade = new Trade(attrs.trade)
    this.isArchived = attrs.isArchived
    this.emailAddress = attrs.emailAddress
  }

  payBand(payAtBand) {
    return payAtBand ? this.currentPayBand : this.cappedPayBand
  }

  get tradeDescription() {
    return `${this.trade.description} (${this.trade.id})`
  }

  get schemeType() {
    return this.scheme?.type
  }

  get schemeDescription() {
    return this.scheme?.description
  }

  get isUnitScheme() {
    return this.scheme?.isUnitScheme
  }

  get payBands() {
    return this.scheme?.payBands
  }

  get currentPayBand() {
    return this.payBands.find((pb) => pb.band == this.salaryBand)
  }

  get cappedPayBand() {
    return this.payBands.find(
      (pb) => pb.band == this.salaryBand || pb.band == 3
    )
  }

  get isEditable() {
    return !this.isArchived
  }
}
