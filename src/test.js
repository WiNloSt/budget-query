import { Budget, getNumbersOfDaysInStartMonth, getNumbersOfDaysInEndMonth } from './query-budget'

describe('Budget', () => {
  let budget
  beforeEach(() => {
    budget = new Budget()
  })

  describe('query', () => {
    describe('given there is no budget', () => {
      test('query', () => {
        const result = budget.query('2018-07-01', '2018-07-31')

        expect(result).toEqual(0)
      })
    })

    describe('given there is budget for one month', () => {
      beforeEach(() => {
        budget.budgets = {
          '2018-07': 3100
        }
      })

      test('query within a budget', () => {
        const result = budget.query('2018-07-01', '2018-07-10')

        expect(result).toEqual(1000)
      })

      test('query whole budget', () => {
        const result = budget.query('2018-01-01', '2018-12-31')

        expect(result).toEqual(3100)
      })

      test('query ends before the budget', () => {
        const result = budget.query('2018-01-01', '2018-01-31')

        expect(result).toEqual(0)
      })

      test('query starts after the budget', () => {
        const result = budget.query('2018-08-01', '2018-08-31')

        expect(result).toEqual(0)
      })
    })

    describe('given there are budgets multiple adjacent months', () => {
      beforeEach(() => {
        budget.budgets = {
          '2018-06': 3000,
          '2018-07': 3100,
          '2018-08': 3100
        }
      })

      test('query multiple months', () => {
        const result = budget.query('2018-06-15', '2018-08-15')

        expect(result).toEqual(16 * 100 + 31 * 100 + 15 * 100)
      })
    })

    describe('there are budgets for multiple months', () => {
      beforeEach(() => {
        budget.budgets = {
          '2017-12': 3100,
          '2019-01': 3100
        }
      })

      test('query contains all budgets', () => {
        const result = budget.query('2016-01-01', '2020-12-31')

        expect(result).toEqual(3100 + 3100)
      })
    })
  })
})
