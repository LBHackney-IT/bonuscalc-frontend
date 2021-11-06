import { compareStrings, truncate } from './string'

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

  describe('truncate', () => {
    it('does not truncate text of the exact length', () => {
      const text = 'Hello World!'

      expect(truncate(text, 12)).toBe('Hello World!')
    })

    it('truncates text at words by default', () => {
      const text = 'Hello World!!'

      expect(truncate(text, 12)).toBe('Hello...')
    })

    it('accepts a custom omission string', () => {
      const options = { omission: '[...]' }
      const text = 'Hello World!'

      expect(truncate(text, 10, options)).toBe('Hello[...]')
    })

    it('accepts a custom separator string', () => {
      const options = { separator: ',' }
      const text = 'Hello, Big World!'

      expect(truncate(text, 13, options)).toBe('Hello...')
    })
  })
})
