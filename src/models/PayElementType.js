export default class PayElementType {
  constructor(attrs) {
    this.id = attrs.id
    this.description = attrs.description
    this.paid = attrs.paid
    this.payAtBand = attrs.payAtBand
    this.adjustment = attrs.adjustment
    this.productive = attrs.productive
  }
}
