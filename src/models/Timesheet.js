import PayElement from './PayElement'
import Week from './Week'

export default class Timesheet {
  constructor(attrs) {
    this.id = attrs.id
    this.week = new Week(attrs.week)
    this.payElements = attrs.payElements.map((pe) => new PayElement(pe))
  }

  get productivePayElements() {
    return this.payElements.filter((pe) => pe.isProductive)
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
    return this.adjustmentPayElements.reduce((sum, pe) => sum + pe.value, 0)
  }

  get nonProductiveTotal() {
    return this.nonProductivePayElements.reduce((sum, pe) => sum + pe.value, 0)
  }

  get nonProductiveAndAdjustmentTotal() {
    return this.adjustmentTotal + this.nonProductiveTotal
  }
}