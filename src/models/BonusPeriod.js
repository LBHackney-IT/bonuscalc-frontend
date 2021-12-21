import dayjs from '@/utils/date'
import { Week } from '@/models'
import { wrap } from '@/utils/number'

export default class BonusPeriod {
  static DURATION = 13

  static get first() {
    return Week.first
  }

  static get last() {
    return Week.last.subtract(this.DURATION - 1, 'weeks')
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

    if (Array.isArray(attrs.weeks)) {
      this.weeks = attrs.weeks.map((week) => {
        return Object.assign(new Week(week), { bonusPeriod: this })
      })
    }
  }

  get dateRange() {
    return `${this.startAt.format('D MMM')} – ${this.endAt.format('D MMM')}`
  }

  get description() {
    return `Period ${this.number} – ${this.year}`
  }

  get previousDescription() {
    const number = wrap(this.number - 1, 4)
    const year = number == 4 ? this.year - 1 : this.year

    return `Period ${number} – ${year}`
  }

  get nextDescription() {
    const number = wrap(this.number + 1, 4)
    const year = number == 1 ? this.year + 1 : this.year

    return `Period ${number} – ${year}`
  }

  get endAt() {
    return this.startAt.add(this.duration, 'weeks').subtract(1, 'millisecond')
  }

  get duration() {
    return BonusPeriod.DURATION
  }

  get first() {
    return BonusPeriod.first
  }

  get last() {
    return BonusPeriod.last
  }

  get previous() {
    return this.startAt.subtract(this.duration, 'weeks')
  }

  get previousDate() {
    return this.previous.toISODate()
  }

  get next() {
    return this.startAt.add(this.duration, 'weeks')
  }

  get nextDate() {
    return this.next.toISODate()
  }

  get isFirst() {
    return this.first.isSameOrAfter(this.startAt)
  }

  get isLast() {
    return this.last.isSameOrBefore(this.startAt)
  }
}
