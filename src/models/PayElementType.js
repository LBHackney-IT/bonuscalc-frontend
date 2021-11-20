export default class PayElementType {
  static get outOfHoursRotaTypeId() {
    return parseInt(process.env.NEXT_PUBLIC_OOH_ROTA_TYPE_ID)
  }

  static get outOfHoursJobTypeId() {
    return parseInt(process.env.NEXT_PUBLIC_OOH_JOB_TYPE_ID)
  }

  constructor(attrs) {
    attrs = attrs || {}

    this.id = attrs.id
    this.description = attrs.description
    this.paid = attrs.paid
    this.payAtBand = attrs.payAtBand
    this.nonProductive = attrs.nonProductive
    this.adjustment = attrs.adjustment
    this.productive = attrs.productive
    this.selectable = attrs.selectable
    this.outOfHours = attrs.outOfHours
    this.overtime = attrs.overtime
  }

  get outOfHoursRota() {
    return this.outOfHours && this.id == PayElementType.outOfHoursRotaTypeId
  }

  get outOfHoursJob() {
    return this.outOfHours && this.id == PayElementType.outOfHoursJobTypeId
  }
}
