import PayElementType from './PayElementType'

export default class PayElement {
  constructor(attrs) {
    this.id = attrs.id
    this.payElementType = new PayElementType(attrs.payElementType)
    this.workOrder = attrs.workOrder
    this.address = attrs.address
    this.comment = attrs.comment
    this.monday = attrs.monday
    this.tuesday = attrs.tuesday
    this.wednesday = attrs.wednesday
    this.thursday = attrs.thursday
    this.friday = attrs.friday
    this.saturday = attrs.saturday
    this.sunday = attrs.sunday
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
