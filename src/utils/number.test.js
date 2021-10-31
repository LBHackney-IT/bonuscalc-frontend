import { round, wrap } from './number'

describe('Number functions', () => {
  describe('round', () => {
    it('rounds down', () => {
      expect(round(0.044, 2)).toBe(0.04)
    })

    it('rounds up', () => {
      expect(round(0.046, 2)).toBe(0.05)
    })

    it('rounds half up', () => {
      expect(round(0.045, 2)).toBe(0.05)
    })
  })

  describe('wrap', () => {
    it('wraps numbers less than the minimum value', () => {
      expect(wrap(0, 4)).toBe(4)
      expect(wrap(-1, 4)).toBe(3)
    })

    it('wraps numbers greater than the maximum value', () => {
      expect(wrap(5, 4)).toBe(1)
      expect(wrap(6, 4)).toBe(2)
    })
  })
})
