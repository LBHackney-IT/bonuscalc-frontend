import PayBand from './PayBand'

export default class Scheme {
  constructor(attrs) {
    this.type = attrs.type
    this.description = attrs.description
    this.conversionFactor = attrs.conversionFactor
    this.payBands = attrs.payBands.map((pb) => new PayBand(pb))
  }

  get isUnitScheme() {
    return this.type == 'Unit'
  }

  get precision() {
    return this.isUnitScheme ? 4 : 2
  }
}
