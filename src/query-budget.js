import moment from 'moment'

export class Budgets {
  budgets = {}

  query(startDate, endDate) {
    const momentStartDate = moment(startDate, 'YYYY-MM-DD')
    const momentEndDate = moment(endDate, 'YYYY-MM-DD')
    const queryPeriod = new Period(momentStartDate, momentEndDate)

    let total = 0
    const monthDiff = momentEndDate.diff(momentStartDate, 'months')
    for (let month = 0; month <= monthDiff; month++) {
      total += new Budget(
        this.budgets,
        queryPeriod,
        new Period(
          moment(momentStartDate)
            .add(month, 'month')
            .startOf('month'),
          moment(momentStartDate)
            .add(month, 'month')
            .endOf('month')
        )
      ).calculateBudget()
    }

    return total
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

    return a.end.diff(b.start, 'days') + 1
  }
}

class Budget {
  constructor(budgets, queryPeriod, monthPeriod) {
    this.budgets = budgets
    this.queryPeriod = queryPeriod
    this.monthPeriod = monthPeriod
  }

  getIntersectedDays() {
    if (this.queryPeriod) return this.queryPeriod.getIntersectedDays(this.monthPeriod)
    return this.end.diff(this.start, 'days') + 1
  }

  calculateBudget() {
    const numberOfDaysInStartMonth = this.getIntersectedDays()
    const amountDaysFirst = this.monthPeriod.start.daysInMonth()
    const firstMonthBudget = this.budgets[this.monthPeriod.start.format('YYYY-MM')] || 0

    return numberOfDaysInStartMonth * (firstMonthBudget / amountDaysFirst)
  }
}
