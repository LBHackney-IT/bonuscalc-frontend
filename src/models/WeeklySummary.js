import dayjs from '@/utils/date'

export default class WeeklySummary {
  constructor(attrs) {
    this.number = attrs.number
    this.startAt = dayjs(attrs.startAt)
    this.closedAt = attrs.closedAt ? dayjs(attrs.closedAt) : null
    this.productiveValue = attrs.productiveValue
    this.nonProductiveDuration = attrs.nonProductiveDuration
    this.nonProductiveValue = attrs.nonProductiveValue
    this.totalValue = attrs.totalValue
    this.utilisation = attrs.utilisation
    this.projectedValue = attrs.projectedValue
    this.averageUtilisation = attrs.averageUtilisation
  }

  get weekId() {
    return this.startAt.toISODate()
  }

  get description() {
    return this.startAt.format('DD/MM/YYYY')
  }

  get endAt() {
    return this.startAt.add(1, 'week').subtract(1, 'millisecond')
  }

  get isClosed() {
    return this.closedAt ? true : false
  }

  get isPast() {
    return dayjs().isAfter(this.endAt)
  }

  get isFuture() {
    return dayjs().isBefore(this.startAt)
  }

  get isCurrent() {
    return !(this.isPast || this.isFuture)
  }
}
