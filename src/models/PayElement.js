import PayElementType from './PayElementType'
import { numberWithPrecision } from '@/utils/number'

export default class PayElement {
  constructor(attrs) {
    attrs = attrs || {}

    this.id = attrs.id
    this.payElementType = new PayElementType(attrs.payElementType)
    this.workOrder = attrs.workOrder
    this.address = attrs.address
    this.comment = attrs.comment
    this.monday = attrs.monday || 0
    this.tuesday = attrs.tuesday || 0
    this.wednesday = attrs.wednesday || 0
    this.thursday = attrs.thursday || 0
    this.friday = attrs.friday || 0
    this.saturday = attrs.saturday || 0
    this.sunday = attrs.sunday || 0
    this.duration = attrs.duration || 0
    this.value = attrs.value || 0
  }

  get payElementTypeId() {
    return this.payElementType.id
  }

  get isAdjustment() {
    return this.payElementType.adjustment
  }

  get isProductive() {
    return this.payElementType.productive
  }

  get isNonProductive() {
    return this.payElementType.nonProductive
  }

  get description() {
    return this.payElementType.description
  }

  toRow() {
    return {
      id: this.id,
      payElementTypeId: this.payElementTypeId,
      workOrder: this.workOrder,
      address: this.address,
      comment: this.comment,
      monday: numberWithPrecision(this.monday, 2),
      tuesday: numberWithPrecision(this.tuesday, 2),
      wednesday: numberWithPrecision(this.wednesday, 2),
      thursday: numberWithPrecision(this.thursday, 2),
      friday: numberWithPrecision(this.friday, 2),
      saturday: numberWithPrecision(this.saturday, 2),
      sunday: numberWithPrecision(this.sunday, 2),
      duration: numberWithPrecision(this.duration, 2),
      value: numberWithPrecision(this.value, 4),
    }
  }
}
