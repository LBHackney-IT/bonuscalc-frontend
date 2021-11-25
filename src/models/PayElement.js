import PayElementType from './PayElementType'
import dayjs from '@/utils/date'
import { numberWithPrecision } from '@/utils/number'

export default class PayElement {
  static get defaultRow() {
    return {
      id: null,
      payElementTypeId: null,
      workOrder: null,
      closedAt: null,
      address: null,
      comment: null,
      monday: '0.00',
      tuesday: '0.00',
      wednesday: '0.00',
      thursday: '0.00',
      friday: '0.00',
      saturday: '0.00',
      sunday: '0.00',
      duration: '0.00',
      value: '0.00',
    }
  }

  static get outOfHoursRota() {
    return new PayElement({
      id: null,
      payElementType: PayElementType.outOfHoursRota,
      workOrder: null,
      closedAt: null,
      address: null,
      comment: null,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
      duration: 0,
      value: 0,
    })
  }

  static get overtimeHours() {
    return new PayElement({
      id: null,
      payElementType: PayElementType.overtimeHours,
      workOrder: null,
      closedAt: null,
      address: null,
      comment: null,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
      duration: 0,
      value: 0,
    })
  }

  static get days() {
    return [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]
  }

  constructor(attrs) {
    attrs = attrs || {}

    this.id = attrs.id
    this.payElementType = new PayElementType(attrs.payElementType)
    this.workOrder = attrs.workOrder
    this.closedAt = attrs.closedAt
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
    this.closedAt = attrs.closedAt ? dayjs(attrs.closedAt) : null
  }

  get payElementTypeId() {
    return this.payElementType.id
  }

  get isAdjustment() {
    return this.payElementType.adjustment
  }

  get isOutOfHours() {
    return this.payElementType.outOfHours
  }

  get isOutOfHoursRota() {
    return this.payElementType.outOfHoursRota
  }

  get isOutOfHoursJob() {
    return this.payElementType.outOfHoursJob
  }

  get isOvertime() {
    return this.payElementType.overtime
  }

  get isOvertimeHours() {
    return this.payElementType.overtimeHours
  }

  get isOvertimeJob() {
    return this.payElementType.overtimeJob
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

  get closedDate() {
    return this.closedAt?.format('DD/MM/YYYY')
  }

  get days() {
    return PayElement.days.reduce((sum, day) => {
      return sum + (this[day] > 0 ? 1 : 0)
    }, 0)
  }

  toRow(precision = 4) {
    return {
      id: this.id,
      payElementTypeId: this.payElementTypeId,
      workOrder: this.workOrder,
      closedAt: this.closedAt,
      address: this.address,
      comment: this.comment,
      monday: numberWithPrecision(this.monday, precision),
      tuesday: numberWithPrecision(this.tuesday, precision),
      wednesday: numberWithPrecision(this.wednesday, precision),
      thursday: numberWithPrecision(this.thursday, precision),
      friday: numberWithPrecision(this.friday, precision),
      saturday: numberWithPrecision(this.saturday, precision),
      sunday: numberWithPrecision(this.sunday, precision),
      duration: numberWithPrecision(this.duration, precision),
      value: numberWithPrecision(this.value, 4),
    }
  }
}
