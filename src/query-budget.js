import moment from 'moment'
import * as R from 'ramda'

export class Budgets {
  budgets = {}

  query(startDate, endDate) {
    const start = moment(startDate, 'YYYY-MM-DD')
    const end = moment(endDate, 'YYYY-MM-DD')
    const queryPeriod = new Period(start, end)

    return this.queryPeriod(queryPeriod)
  }

  queryPeriod(period) {
    return R.compose(
      R.sum,
      R.map(budget => budget.getOverlappingBudget(period)),
      budgets =>
        Object.keys(budgets).map(month => {
          const value = budgets[month]
          return new Budget(moment(month, 'YYYY-MM'), value)
        })
    )(this.budgets)
  }
}

class Period {
  constructor(start, end) {
    this.start = start
    this.end = end
  }

  getDays() {
    return this.end.diff(this.start, 'days') + 1
  }

  getIntersectedDays(another) {
    const a = this.start < another.start ? this : another
    const b = this.start < another.start ? another : this

    if (a.end < b.start) return 0

    if (a.end > b.end) return b.getDays()

    return new Period(b.start, a.end).getDays()
  }
}

class Budget {
  constructor(date, value) {
    this.date = date
    this.amount = value
  }

  getOverlappingBudget(period) {
    const overlappingDays = period.getIntersectedDays(
      new Period(moment(this.date).startOf('month'), moment(this.date).endOf('month'))
    )

    return overlappingDays * (this.amount / this.date.daysInMonth())
  }
}
