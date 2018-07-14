import moment from 'moment'

export class Budget {
  budgets = {}

  query(startDate, endDate) {
    const momentStartDate = moment(startDate, 'YYYY-MM-DD')
    const momentEndDate = moment(endDate, 'YYYY-MM-DD')

    if (momentStartDate.month() === momentEndDate.month()) {
      const diffDays = momentEndDate.diff(momentStartDate, 'days') + 1
      const budget =
        ((this.budgets[momentStartDate.format('YYYY-MM')] || 0) / momentStartDate.daysInMonth()) *
        diffDays
      return budget
    } else {
      // start month
      const firstMonthPeriod = new Period(momentStartDate, moment(momentStartDate).endOf('month'))
      const numberOfDaysInStartMonth = firstMonthPeriod.getDays()
      const amountDaysFirst = momentStartDate.daysInMonth()
      const firstMonthBudget = this.budgets[momentStartDate.format('YYYY-MM')] || 0
      const totalBudgetFirstMonth = numberOfDaysInStartMonth * (firstMonthBudget / amountDaysFirst)

      // months in between
      const monthDiff = momentEndDate.diff(momentStartDate, 'months') - 1
      let budgetMonthsInbetween = 0
      for (let month = 1; month <= monthDiff; month++) {
        const monthString = moment(momentStartDate)
          .add(month, 'month')
          .format('YYYY-MM')
        const budgetThisMonth = this.budgets[monthString] || 0
        budgetMonthsInbetween += budgetThisMonth
      }

      // end month

      const lastMonthPeriod = new Period(moment(momentEndDate).startOf('month'), momentEndDate)
      const numberOfDaysInLastMonth = lastMonthPeriod.getDays()
      const amountDaysLast = momentEndDate.daysInMonth()
      const lastMonthBudget = this.budgets[momentEndDate.format('YYYY-MM')] || 0
      const totalBudgetLastMonth = numberOfDaysInLastMonth * (lastMonthBudget / amountDaysLast)

      return totalBudgetFirstMonth + budgetMonthsInbetween + totalBudgetLastMonth
    }
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
}
