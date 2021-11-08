export default class PayElementType {
  constructor(attrs) {
    attrs = attrs || {}

    this.id = attrs.id
    this.description = attrs.description
    this.paid = attrs.paid
    this.payAtBand = attrs.payAtBand
    this.nonProductive = attrs.nonProductive
    this.adjustment = attrs.adjustment
    this.productive = attrs.productive
  }
}
