import dayjs from 'dayjs'

export default class BonusPeriod {
  constructor(attrs) {
    this.id = attrs.id
    this.year = attrs.year
    this.number = attrs.number
    this.startAt = dayjs(attrs.startAt)
    this.closeAt = attrs.closedAt ? dayjs(attrs.closedAt) : null
  }
}
