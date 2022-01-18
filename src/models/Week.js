import BonusPeriod from './BonusPeriod'
import OperativeSummary from './OperativeSummary'
import dayjs from '@/utils/date'
import { wrap } from '@/utils/number'

export default class Week {
  static get first() {
    return dayjs(process.env.NEXT_PUBLIC_FIRST_WEEK)
  }

  static get last() {
    return dayjs(process.env.NEXT_PUBLIC_LAST_WEEK)
  }

  static get current() {
    const current = dayjs().startOf('week')
    return this.max(this.first, current).toISODate()
  }

  static default(bonusPeriod) {
    const startAt = dayjs(bonusPeriod)
    const endAt = startAt.add(BonusPeriod.DURATION, 'weeks')
    const current = dayjs(this.current)

    if (current.isAfter(startAt)) {
      if (current.isBefore(endAt)) {
        return this.current
      } else {
        return bonusPeriod
      }
    } else {
      return bonusPeriod
    }
  }

  static max(a, b) {
    return a.isBefore(b) ? b : a
  }

  constructor(attrs) {
    this.id = attrs.id
    this.number = attrs.number
    this.startAt = dayjs(attrs.startAt)
    this.closedAt = attrs.closedAt ? dayjs(attrs.closedAt) : null
    this.closedBy = attrs.closedBy
    this.reportsSentAt = attrs.reportsSentAt ? dayjs(attrs.reportsSentAt) : null
    this.bonusPeriod = attrs.bonusPeriod
      ? new BonusPeriod(attrs.bonusPeriod)
      : null
    this.operativeSummaries = attrs.operativeSummaries
      ? attrs.operativeSummaries.map((os) => new OperativeSummary(os))
      : null
  }

  get startDate() {
    return this.startAt.format('DD/MM/YYYY')
  }

  get closedDate() {
    return this.closedAt?.format('DD/MM/YYYY')
  }

  get description() {
    return `${this.bonusPeriod.description} / week ${this.number}`
  }

  get previousDescription() {
    const weekNumber = wrap(this.number - 1, 13)
    const periodNumber =
      weekNumber == 13
        ? wrap(this.bonusPeriod.number - 1, 4)
        : this.bonusPeriod.number
    const periodYear =
      periodNumber == 4 && this.bonusPeriod.number == 1
        ? this.bonusPeriod.year - 1
        : this.bonusPeriod.year

    return `Period ${periodNumber} – ${periodYear} / week ${weekNumber}`
  }

  get nextDescription() {
    const weekNumber = wrap(this.number + 1, 13)
    const periodNumber =
      weekNumber == 1
        ? wrap(this.bonusPeriod.number + 1, 4)
        : this.bonusPeriod.number
    const periodYear =
      periodNumber == 1 && this.bonusPeriod.number == 4
        ? this.bonusPeriod.year + 1
        : this.bonusPeriod.year

    return `Period ${periodNumber} – ${periodYear} / week ${weekNumber}`
  }

  get dateRange() {
    if (this.endAt.month() === this.startAt.month()) {
      return `${this.startAt.format('D')} – ${this.endAt.format('D MMM')}`
    } else {
      return `${this.startAt.format('D MMM')} – ${this.endAt.format('D MMM')}`
    }
  }

  get endAt() {
    return this.next.subtract(1, 'millisecond')
  }

  get first() {
    return Week.first
  }

  get last() {
    return Week.last
  }

  get previous() {
    return this.startAt.subtract(1, 'week')
  }

  get previousDate() {
    return this.previous.toISODate()
  }

  get next() {
    return this.startAt.add(1, 'week')
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

  get isClosed() {
    return this.closedAt ? true : false
  }

  get isEditable() {
    return !this.isClosed
  }

  get isCurrent() {
    return dayjs().isBetween(this.startAt, this.endAt)
  }

  get isPast() {
    return dayjs().isAfter(this.endAt)
  }

  get isFuture() {
    return dayjs().isBefore(this.startAt)
  }

  get isVisible() {
    return !this.isCompleted && (this.isCurrent || this.isPast)
  }

  get operativeCount() {
    return this.operativeSummaries.length
  }

  get sentOperatives() {
    return this.operativeSummaries.filter((os) => os.reportSentAt)
  }

  get sentOperativeCount() {
    return this.sentOperatives.length
  }

  get hasOutstandingReports() {
    return this.isClosed && !this.reportsSentAt
  }

  get isCompleted() {
    return this.isClosed && this.reportsSentAt
  }
}
