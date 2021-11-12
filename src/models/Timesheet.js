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

  get nonProductivePayElements() {
    return this.payElements.filter((pe) => pe.isNonProductive)
  }

  get hasNonProductivePayElements() {
    return this.nonProductivePayElements.length > 0
  }

  get adjustmentTotal() {
    return this.adjustmentPayElements.reduce(totalValue, 0)
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
