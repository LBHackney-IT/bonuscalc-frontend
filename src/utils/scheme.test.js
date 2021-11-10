import { bandForValue } from './scheme'

describe('Scheme functions', () => {
  describe('bandForValue', () => {
    const payBands = [
      { band: 1, value: 2160 },
      { band: 2, value: 2772 },
      { band: 3, value: 3132 },
      { band: 4, value: 3366 },
      { band: 5, value: 3618 },
      { band: 6, value: 3888 },
      { band: 7, value: 4182 },
      { band: 8, value: 4494 },
      { band: 9, value: 4836 },
    ]

    it('returns the correct band', () => {
      expect(bandForValue(payBands, 0)).toBe(1)
      expect(bandForValue(payBands, 1000)).toBe(1)
      expect(bandForValue(payBands, 2500)).toBe(1)
      expect(bandForValue(payBands, 2772)).toBe(2)
      expect(bandForValue(payBands, 3000)).toBe(2)
      expect(bandForValue(payBands, 3132)).toBe(3)
      expect(bandForValue(payBands, 3200)).toBe(3)
      expect(bandForValue(payBands, 3366)).toBe(4)
      expect(bandForValue(payBands, 3500)).toBe(4)
      expect(bandForValue(payBands, 3618)).toBe(5)
      expect(bandForValue(payBands, 3700)).toBe(5)
      expect(bandForValue(payBands, 3888)).toBe(6)
      expect(bandForValue(payBands, 4000)).toBe(6)
      expect(bandForValue(payBands, 4182)).toBe(7)
      expect(bandForValue(payBands, 4300)).toBe(7)
      expect(bandForValue(payBands, 4494)).toBe(8)
      expect(bandForValue(payBands, 4600)).toBe(8)
      expect(bandForValue(payBands, 4836)).toBe(9)
      expect(bandForValue(payBands, 5000)).toBe(9)
      expect(bandForValue(payBands, 10000)).toBe(9)
    })
  })
})
