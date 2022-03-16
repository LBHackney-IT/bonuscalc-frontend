import PayElementType from './PayElementType'
import Week from './Week'
import dayjs from '@/utils/date'
import { numberWithPrecision } from '@/utils/number'
import { smvh } from '@/utils/scheme'

export default class WorkElement {
  constructor(attrs) {
    this.id = attrs.id
    this.payElementType = new PayElementType(attrs.payElementType)
    this.workOrder = attrs.workOrder
    this.address = attrs.address
    this.description = attrs.description
    this.operativeId = attrs.operativeId
    this.operativeName = attrs.operativeName
    this.week = new Week(attrs.week)
    this.value = attrs.value
    this.closedAt = dayjs(attrs.closedAt)
  }

  get closedDate() {
    return this.closedAt?.format('DD/MM/YYYY')
  }

  get isOutOfHours() {
    return this.payElementType.outOfHours
  }

  get isOvertime() {
    return this.payElementType.overtime
  }

  get baseUrl() {
    return `/operatives/${this.operativeId}`
  }

  get timesheetUrl() {
    if (this.isOvertime) {
      return `${this.baseUrl}/timesheets/${this.week.id}/overtime`
    } else if (this.isOutOfHours) {
      return `${this.baseUrl}/timesheets/${this.week.id}/out-of-hours`
    } else {
      return `${this.baseUrl}/timesheets/${this.week.id}/productive`
    }
  }

  get summaryUrl() {
    return `${this.baseUrl}/summaries/${this.week.bonusPeriod.id}`
  }

  get formattedValue() {
    if (this.isOutOfHours || this.isOvertime) {
      return `£${numberWithPrecision(this.value, 2)}`
    } else {
      return numberWithPrecision(smvh(this.value), 2)
    }
  }
}
