export default class PayElementType {
  static get outOfHoursRotaTypeId() {
    return parseInt(process.env.NEXT_PUBLIC_OOH_ROTA_TYPE_ID)
  }

  static get outOfHoursJobTypeId() {
    return parseInt(process.env.NEXT_PUBLIC_OOH_JOB_TYPE_ID)
  }

  static get outOfHoursRota() {
    return new PayElementType({
      id: this.outOfHoursRotaTypeId,
      description: 'OOH Rota',
      paid: false,
      payAtBand: false,
      nonProductive: false,
      adjustment: false,
      productive: false,
      selectable: true,
      outOfHours: true,
      overtime: false,
    })
  }

  static get outOfHoursRate() {
    return parseFloat(process.env.NEXT_PUBLIC_OOH_RATE)
  }

  static get overtimeHoursTypeId() {
    return parseInt(process.env.NEXT_PUBLIC_OVERTIME_HOURS_TYPE_ID)
  }

  static get overtimeJobTypeId() {
    return parseInt(process.env.NEXT_PUBLIC_OVERTIME_JOB_TYPE_ID)
  }

  static get overtimeHours() {
    return new PayElementType({
      id: this.overtimeHoursTypeId,
      description: 'Overtime Hours',
      paid: false,
      payAtBand: false,
      nonProductive: false,
      adjustment: false,
      productive: false,
      selectable: true,
      outOfHours: false,
      overtime: true,
    })
  }

  static get overtimeRate() {
    return parseFloat(process.env.NEXT_PUBLIC_OVERTIME_RATE)
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
    this.smvPerHour = attrs.smvPerHour
  }

  get outOfHoursRota() {
    return this.outOfHours && this.id == PayElementType.outOfHoursRotaTypeId
  }

  get outOfHoursJob() {
    return this.outOfHours && this.id == PayElementType.outOfHoursJobTypeId
  }

  get overtimeHours() {
    return this.overtime && this.id == PayElementType.overtimeHoursTypeId
  }

  get overtimeJob() {
    return this.overtime && this.id == PayElementType.overtimeJobTypeId
  }
}
