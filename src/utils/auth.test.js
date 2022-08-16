import { isEditable } from './auth'

describe('isEditable', () => {
  describe('when the operative is archived', () => {
    const operative = { isArchived: true }

    test('returns false', () => {
      const week = { isEditable: true }
      const period = { isClosed: false }
      const user = { hasWeekManagerPermissions: false }

      expect(isEditable(operative, week, period, user)).toBe(false)
    })
  })

  describe('when the operative is not archived', () => {
    const operative = { isArchived: false }

    describe('when the period is closed', () => {
      const period = { isClosed: true }

      test('returns false', () => {
        const week = { isEditable: true }
        const user = { hasWeekManagerPermissions: false }

        expect(isEditable(operative, week, period, user)).toBe(false)
      })
    })

    describe('when the period is open', () => {
      const period = { isClosed: false }

      describe('when the week is open', () => {
        const week = { isEditable: true }

        test('returns true', () => {
          const user = { hasWeekManagerPermissions: false }

          expect(isEditable(operative, week, period, user)).toBe(true)
        })
      })

      describe('when the week is closed', () => {
        const week = { isEditable: false }

        describe('when the user is not a week manager', () => {
          const user = { hasWeekManagerPermissions: false }

          test('returns false', () => {
            expect(isEditable(operative, week, period, user)).toBe(false)
          })
        })

        describe('when the user is a week manager', () => {
          const user = { hasWeekManagerPermissions: true }

          test('returns true', () => {
            expect(isEditable(operative, week, period, user)).toBe(true)
          })
        })
      })
    })
  })
})
