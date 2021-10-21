import PayElementType from './PayElementType'

export default class PayElement {
  constructor(attrs) {
    this.id = attrs.id
    this.payElementType = new PayElementType(attrs.payElementType)
    this.weekDay = attrs.weekDay
    this.workOrder = attrs.workOrder
    this.address = attrs.address
    this.comment = attrs.comment
    this.duration = attrs.duration
    this.value = attrs.value
  }

  get isAdjustment() {
    return this.payElementType.adjustment
  }

  get isProductive() {
    return this.payElementType.productive
  }

  get isNonProductive() {
    return !(this.isAdjustment || this.isProductive)
  }

  get description() {
    return this.payElementType.description
  }
}
