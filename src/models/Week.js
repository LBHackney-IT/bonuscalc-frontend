import BonusPeriod from './BonusPeriod'
import dayjs from '@/utils/date'
import { wrap } from '@/utils/number'

export default class Week {
  static get current() {
    return dayjs().startOf('week')
  }

  constructor(attrs) {
    this.id = attrs.id
    this.number = attrs.number
    this.bonusPeriod = new BonusPeriod(attrs.bonusPeriod)
    this.startAt = dayjs(attrs.startAt)
    this.closedAt = attrs.closedAt ? dayjs(attrs.closedAt) : null
  }

  get startDate() {
    return this.startAt.format('DD/MM/YYYY')
  }

  get description() {
    return `Period ${this.bonusPeriod.number} - ${this.bonusPeriod.year} / week ${this.number}`
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

    return `Period ${periodNumber} - ${periodYear} / week ${weekNumber}`
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

    return `Period ${periodNumber} - ${periodYear} / week ${weekNumber}`
  }

  get dateRange() {
    if (this.next.month() > this.month) {
      return `${this.startAt.format('D MMMM')} - ${this.endAt.format('D MMMM')}`
    } else {
      return `${this.startAt.format('D')} - ${this.endAt.format('D MMMM')}`
    }
  }

  get endAt() {
    return this.next.subtract(1, 'millisecond')
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

  get isClosed() {
    return this.closedAt ? true : false
  }

  get isEditable() {
    return !this.isClosed
  }
}
