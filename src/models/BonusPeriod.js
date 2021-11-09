import dayjs from '@/utils/date'

export default class BonusPeriod {
  constructor(attrs) {
    this.id = attrs.id
    this.year = attrs.year
    this.number = attrs.number
    this.startAt = dayjs(attrs.startAt)
    this.closedAt = attrs.closedAt ? dayjs(attrs.closedAt) : null
  }

  get description() {
    return `Period ${this.number} – ${this.year}`
  }
}
