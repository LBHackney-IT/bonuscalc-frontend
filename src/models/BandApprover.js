import dayjs from '@/utils/date'

export default class BandApprover {
  constructor(attrs) {
    this.name = attrs.name
    this.emailAddress = attrs.emailAddress
    this.decision = attrs.decision
    this.reason = attrs.reason
    this.salaryBand = attrs.salaryBand
    this.updatedAt = attrs.updatedAt ? dayjs(attrs.updatedAt) : null
  }

  get date() {
    return this.updatedAt?.format('DD/MM/YYYY')
  }
}
