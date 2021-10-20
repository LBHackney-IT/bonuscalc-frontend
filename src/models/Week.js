import BonusPeriod from './BonusPeriod'
import dayjs from '../utils/date'
import { wrap } from '../utils/number'

export default class Week {
  static current() {
    return dayjs().startOf('week').format('YYYY-MM-DD')
  }

  constructor(attrs) {
    this.id = attrs.id
    this.number = attrs.number
    this.bonusPeriod = new BonusPeriod(attrs.bonusPeriod)
    this.startAt = dayjs(attrs.startAt)
    this.closedAt = attrs.closedAt ? dayjs(attrs.closedAt) : null
  }

  previousUrl(baseUrl) {
    return `${baseUrl}?week=${this.previous.toISODate()}`
  }

  nextUrl(baseUrl) {
    return `${baseUrl}?week=${this.next.toISODate()}`
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
      periodNumber == 4 ? this.bonusPeriod.year - 1 : this.bonusPeriod.year

    return `Period ${periodNumber} - ${periodYear} / week ${weekNumber}`
  }

  get nextDescription() {
    const weekNumber = wrap(this.number + 1, 13)
    const periodNumber =
      weekNumber == 1
        ? wrap(this.bonusPeriod.number + 1, 4)
        : this.bonusPeriod.number
    const periodYear =
      periodNumber == 1 ? this.bonusPeriod.year + 1 : this.bonusPeriod.year

    return `Period ${periodNumber} - ${periodYear} / week ${weekNumber}`
  }

  get previous() {
    return this.startAt.subtract(1, 'week')
  }

  get next() {
    return this.startAt.add(1, 'week')
  }

  get isClosed() {
    return this.closedAt ? true : false
  }
}
