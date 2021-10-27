import { compareStrings } from './string'

describe('String functions', () => {
  describe('compareStrings', () => {
    it('A and B returns -1', () => {
      expect(compareStrings('A', 'B')).toBe(-1)
    })

    it('B and A returns 1', () => {
      expect(compareStrings('B', 'A')).toBe(1)
    })

    it('A and A returns 0', () => {
      expect(compareStrings('A', 'A')).toBe(0)
    })
  })
})
