import { buildUser, OPERATIVE_MANAGER_ROLE } from './user'

const { OPERATIVE_MANAGERS_GOOGLE_GROUPNAME, WEEK_MANAGERS_GOOGLE_GROUPNAME } =
  process.env

describe('buildUser', () => {
  describe('hasOperativeManagerPermissions', () => {
    const user = buildUser('', '', [OPERATIVE_MANAGERS_GOOGLE_GROUPNAME])

    describe('when the supplied role maps to the group name for the user', () => {
      it('returns true', () => {
        expect(user.hasOperativeManagerPermissions).toBe(true)
      })
    })

    describe('when the group name for the user does not map to a recognised role', () => {
      const user = buildUser('', '', ['a made up group'])

      it('returns false', () => {
        expect(user.hasOperativeManagerPermissions).toBe(false)
      })
    })

    describe('when no group names are supplied', () => {
      const user = buildUser('', '', [])

      it('returns false', () => {
        expect(user.hasOperativeManagerPermissions).toBe(false)
      })
    })
  })

  describe('hasWeekManagerPermissions', () => {
    const user = buildUser('', '', [WEEK_MANAGERS_GOOGLE_GROUPNAME])

    describe('when the supplied role maps to the group name for the user', () => {
      it('returns true', () => {
        expect(user.hasWeekManagerPermissions).toBe(true)
      })
    })

    describe('when the group name for the user does not map to a recognised role', () => {
      const user = buildUser('', '', ['a made up group'])

      it('returns false', () => {
        expect(user.hasWeekManagerPermissions).toBe(false)
      })
    })

    describe('when no group names are supplied', () => {
      const user = buildUser('', '', [])

      it('returns false', () => {
        expect(user.hasWeekManagerPermissions).toBe(false)
      })
    })
  })

  describe('hasRole', () => {
    const user = buildUser('', '', [OPERATIVE_MANAGERS_GOOGLE_GROUPNAME])

    describe('when the supplied role maps to the group name for the user', () => {
      it('returns true', () => {
        expect(user.hasRole(OPERATIVE_MANAGER_ROLE)).toBe(true)
      })
    })

    describe('when the group name for the user does not map to a recognised role', () => {
      const user = buildUser('', '', ['a made up group'])

      it('returns false', () => {
        expect(user.hasRole(OPERATIVE_MANAGER_ROLE)).toBe(false)
      })
    })

    describe('when no group names are supplied', () => {
      const user = buildUser('', '', [])

      it('returns false', () => {
        expect(user.hasRole(OPERATIVE_MANAGER_ROLE)).toBe(false)
      })
    })
  })

  describe('hasAnyPermissions', () => {
    describe('when the group name for the user maps to a recognised role', () => {
      const user = buildUser('', '', [OPERATIVE_MANAGERS_GOOGLE_GROUPNAME])

      it('returns true', () => {
        expect(user.hasAnyPermissions).toBe(true)
      })
    })

    describe('when the group name for the user does not map to a recognised role', () => {
      const user = buildUser('', '', ['a made up group'])

      it('returns false', () => {
        expect(user.hasAnyPermissions).toBe(false)
      })
    })

    describe('when no group names are supplied', () => {
      const user = buildUser('', '', [])

      it('returns false', () => {
        expect(user.hasAnyPermissions).toBe(false)
      })
    })
  })
})
