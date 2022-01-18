import BonusPeriod from './BonusPeriod'
import WeeklySummary from './WeeklySummary'

export default class Summary {
  constructor(attrs) {
    this.id = attrs.id
    this.bonusPeriod = new BonusPeriod(attrs.bonusPeriod)
    this.weeklySummaries = attrs.weeklySummaries.map(
      (ws) => new WeeklySummary(ws)
    )
  }

  get hasWeeklySummaries() {
    return this.weeklySummaries.length > 0
  }

  get totalProductiveValue() {
    return this.weeklySummaries.reduce((sum, ws) => {
      return sum + ws.productiveValue
    }, 0)
  }

  get totalNonProductiveValue() {
    return this.weeklySummaries.reduce((sum, ws) => {
      return sum + ws.nonProductiveValue
    }, 0)
  }

  get totalNonProductiveDuration() {
    return this.weeklySummaries.reduce((sum, ws) => {
      return sum + ws.nonProductiveDuration
    }, 0)
  }

  get totalValueForBonusPeriod() {
    return this.weeklySummaries.reduce((sum, ws) => {
      return sum + ws.totalValue
    }, 0)
  }

  get projectedValue() {
    return this.weeklySummaries.reduce((projected, ws) => {
      return ws.projectedValue
    }, 0)
  }

  get averageUtilisation() {
    return this.weeklySummaries.reduce((average, ws) => {
      return ws.averageUtilisation
    }, 1)
  }

  get closedWeeklySummaries() {
    return this.weeklySummaries.filter((ws) => ws.isClosed)
  }

  get lastClosedWeeklySummary() {
    return this.closedWeeklySummaries[this.closedWeeklySummaries.length - 1]
  }

  get hasClosedWeeklySummaries() {
    return this.closedWeeklySummaries.length > 0
  }

  get totalClosedProductiveValue() {
    return this.closedWeeklySummaries.reduce((sum, ws) => {
      return sum + ws.productiveValue
    }, 0)
  }

  get totalClosedNonProductiveValue() {
    return this.closedWeeklySummaries.reduce((sum, ws) => {
      return sum + ws.nonProductiveValue
    }, 0)
  }

  get totalClosedNonProductiveDuration() {
    return this.closedWeeklySummaries.reduce((sum, ws) => {
      return sum + ws.nonProductiveDuration
    }, 0)
  }

  get totalClosedValueForBonusPeriod() {
    return this.closedWeeklySummaries.reduce((sum, ws) => {
      return sum + ws.totalValue
    }, 0)
  }

  get projectedClosedValue() {
    return this.closedWeeklySummaries.reduce((projected, ws) => {
      return ws.projectedValue
    }, 0)
  }

  get averageClosedUtilisation() {
    return this.closedWeeklySummaries.reduce((average, ws) => {
      return ws.averageUtilisation
    }, 1)
  }
}
