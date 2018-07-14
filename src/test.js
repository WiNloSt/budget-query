import { Budget, getNumbersOfDaysInStartMonth, getNumbersOfDaysInEndMonth } from './query-budget'

describe('Budget', () => {
  let budget
  beforeEach(() => {
    budget = new Budget()
  })

  describe('query', () => {
    describe('given there is no budget', () => {
      describe('when query from 2018-07-01 to 2018-07-31', () => {
        it('should return 0', () => {
          let result = budget.query('2018-07-01', '2018-07-31')
          expect(result).toEqual(0)
        })
      })
    })
    describe('given there is budget for 2018-07: 3100', () => {
      beforeEach(() => {
        budget.budgets = {
          '2018-07': 3100
        }
      })

      describe('when query from 2018-07-01 to 2018-07-10', () => {
        it('should return 1000', () => {
          const result = budget.query('2018-07-01', '2018-07-10')

          expect(result).toEqual(1000)
        })
      })

      describe('when query from 2018-01-01 to 2018-12-31', () => {
        it('should return 3100', () => {
          const result = budget.query('2018-01-01', '2018-12-31')

          expect(result).toEqual(3100)
        })
      })

      describe('when query from 2018-01-01 to 2018-01-31', () => {
        it('should return 0', () => {
          const result = budget.query('2018-01-01', '2018-01-31')

          expect(result).toEqual(0)
        })
      })
    })

    describe(`given there is budget for 2018-06: 3000, 2018-07: 3100, 2018-08: 3100`, () => {
      beforeEach(() => {
        budget.budgets = {
          '2018-06': 3000,
          '2018-07': 3100,
          '2018-08': 3100
        }
      })

      describe('when query from 2018-06-15 to 2018-08-15', () => {
        it('should return 6200', () => {
          const result = budget.query('2018-06-15', '2018-08-15')

          expect(result).toEqual(6200)
        })
      })

      describe('when query from 2018-07-15 to 2018-08-15', () => {
        it('should return 3200', () => {
          const result = budget.query('2018-07-15', '2018-08-15')

          expect(result).toEqual(3200)
        })
      })
    })

    describe('given there is budget for 2017-12: 3100, 2019-01: 3100', () => {
      beforeEach(() => {
        budget.budgets = {
          '2017-12': 3100,
          '2019-01': 3100
        }
      })

      describe('when query from 2016-01-01 to 2020-12-31', () => {
        it('should return 6200', () => {
          const result = budget.query('2016-01-01', '2020-12-31')

          expect(result).toEqual(6200)
        })
      })
    })
  })
})

describe('getNumbersOfDaysInStartMonth', () => {
  describe('when month is 2018-07-01', () => {
    it('should return 31', () => {
      const result = getNumbersOfDaysInStartMonth('2018-07-01')
      expect(result).toEqual(31)
    })
  })
})

describe('getNumbersOfDaysInEndMonth', () => {
  describe('when date is 2018-07-15', () => {
    it('should return 15', () => {
      const result = getNumbersOfDaysInEndMonth('2018-07-15')
      expect(result).toEqual(15)
    })
  })
})
