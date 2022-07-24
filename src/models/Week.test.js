import Week from './Week'
import MockDate from 'mockdate'

describe('Week', () => {
  afterEach(() => {
    MockDate.reset()
  })

  describe('.first', () => {
    test('returns a dayjs object', () => {
      expect(typeof Week.first).toBe('object')
    })

    test('is controlled by an environment variable', () => {
      const firstWeek = Week.first

      expect(firstWeek.year()).toBe(2021)
      expect(firstWeek.month()).toBe(7)
      expect(firstWeek.date()).toBe(2)
    })
  })

  describe('.last', () => {
    describe('when it is week 1', () => {
      test('returns the last week of the current period', () => {
        MockDate.set(new Date('2022-02-02T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(3)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 2', () => {
      test('returns the last week of the current period', () => {
        MockDate.set(new Date('2022-02-09T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(3)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 3', () => {
      test('returns the last week of the current period', () => {
        MockDate.set(new Date('2022-02-16T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(3)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 4', () => {
      test('returns the last week of the current period', () => {
        MockDate.set(new Date('2022-02-23T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(3)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 5', () => {
      test('returns the last week of the current period', () => {
        MockDate.set(new Date('2022-03-02T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(3)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 6', () => {
      test('returns the last week of the current period', () => {
        MockDate.set(new Date('2022-03-09T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(3)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 7', () => {
      test('returns the last week of the current period', () => {
        MockDate.set(new Date('2022-03-16T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(3)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 8', () => {
      test('returns the last week of the current period', () => {
        MockDate.set(new Date('2022-03-23T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(3)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 9', () => {
      test('returns the last week of the current period', () => {
        MockDate.set(new Date('2022-03-30T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(3)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 10', () => {
      test('returns the last week of the current period', () => {
        MockDate.set(new Date('2022-04-06T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(3)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 11', () => {
      test('returns the last week of the next period', () => {
        MockDate.set(new Date('2022-04-13T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(6)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 12', () => {
      test('returns the last week of the next period', () => {
        MockDate.set(new Date('2022-04-20T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(6)
        expect(lastWeek.date()).toBe(25)
      })
    })

    describe('when it is week 13', () => {
      test('returns the last week of the next period', () => {
        MockDate.set(new Date('2022-04-27T12:00:00Z'))
        const lastWeek = Week.last

        expect(lastWeek.year()).toBe(2022)
        expect(lastWeek.month()).toBe(6)
        expect(lastWeek.date()).toBe(25)
      })
    })
  })
})
