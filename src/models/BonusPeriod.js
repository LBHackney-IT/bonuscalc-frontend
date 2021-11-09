import dayjs from '@/utils/date'
import { Week } from '@/models'
import { wrap } from '@/utils/number'

export default class BonusPeriod {
  static DURATION = 13

  static get first() {
    return Week.first
  }

  static get current() {
    const current = this.forWeek(Week.current)
    return this.max(this.first, dayjs(current)).toISODate()
  }

  static max(a, b) {
    return a.isBefore(b) ? b : a
  }

  static forWeek(week) {
    const offset = dayjs.duration(dayjs(week).diff(this.first))
    const number = wrap(offset.asWeeks() + 1, this.DURATION) - 1
    return dayjs(week).subtract(number, 'weeks').toISODate()
  }

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
