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
    this.projectedValue = attrs.projectedValue
  }

  get description() {
    return this.startAt.format('DD/MM/YYYY')
  }
}
