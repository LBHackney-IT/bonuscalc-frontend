import PayElement from './PayElement'
import Week from './Week'

export default class Timesheet {
  constructor(attrs) {
    this.id = attrs.id
    this.week = new Week(attrs.week)
    this.payElements = attrs.payElements.map((pe) => new PayElement(pe))
  }
}
