import PayElement from './PayElement'
import Week from './Week'

const totalDuration = (total, pe) => {
  return total + pe.duration
}

const totalValue = (total, pe) => {
  return total + pe.value
}

export default class Timesheet {
  constructor(attrs) {
    this.id = attrs.id
    this.week = new Week(attrs.week)
    this.payElements = attrs.payElements.map((pe) => new PayElement(pe))
  }

  addPayElement() {
    this.payElements.push(new PayElement())
  }

  removePayElement(payElement) {
    const index = this.payElements.findIndex((pe) => pe.id == payElement.id)
    if (index >= 0) this.payElements.splice(index, 1)
  }

  get weekId() {
    return this.week.id
  }

  get productivePayElements() {
    return this.payElements.filter((pe) => pe.isProductive && !pe.isAdjustment)
  }

  get hasProductivePayElements() {
    return this.productivePayElements.length > 0
  }

  get adjustmentPayElements() {
    return this.payElements.filter((pe) => pe.isAdjustment)
  }

  get hasAdjustmentPayElements() {
    return this.adjustmentPayElements.length > 0
  }

  get outOfHoursRota() {
    return this.payElements.filter((pe) => pe.isOutOfHoursRota)
  }

  get hasOutOfHoursRota() {
    return this.outOfHoursRota.length > 0
  }

  get outOfHoursJobs() {
    return this.payElements.filter((pe) => pe.isOutOfHoursJob)
  }

  get hasOutOfHoursJobs() {
    return this.outOfHoursJobs.length > 0
  }

  get hasOvertimeHours() {
    return this.overtimeHours.length > 0
  }

  get overtimeHours() {
    return this.payElements.filter((pe) => pe.isOvertimeHours)
  }

  get sortedOvertimeHours() {
    return this.overtimeHours.sort((a, b) => a.compare(b))
  }

  get hasOvertimeJobs() {
    return this.overtimeJobs.length > 0
  }

  get overtimeJobs() {
    return this.payElements.filter((pe) => pe.isOvertimeJob)
  }

  get nonProductivePayElements() {
    return this.payElements.filter((pe) => pe.isNonProductive)
  }

  get hasNonProductivePayElements() {
    return this.nonProductivePayElements.length > 0
  }

  get adjustmentTotal() {
    return this.adjustmentPayElements.reduce(totalValue, 0)
  }

  get outOfHoursRotaTotal() {
    return this.outOfHoursRota.reduce(totalValue, 0)
  }

  get outOfHoursJobsTotal() {
    return this.outOfHoursJobs.reduce(totalValue, 0)
  }

  get outOfHoursTotal() {
    return this.outOfHoursRotaTotal + this.outOfHoursJobsTotal
  }

  get overtimeHoursTotal() {
    return this.overtimeHours.reduce(totalValue, 0)
  }

  get overtimeJobsTotal() {
    return this.overtimeJobs.reduce(totalValue, 0)
  }

  get overtimeTotal() {
    return this.overtimeHoursTotal + this.overtimeJobsTotal
  }

  get nonProductiveDuration() {
    return this.nonProductivePayElements.reduce(totalDuration, 0)
  }

  get nonProductiveTotal() {
    return this.nonProductivePayElements.reduce(totalValue, 0)
  }

  get nonProductiveAndAdjustmentTotal() {
    return this.adjustmentTotal + this.nonProductiveTotal
  }

  get productiveTotal() {
    return this.productivePayElements.reduce(totalValue, 0)
  }
}
