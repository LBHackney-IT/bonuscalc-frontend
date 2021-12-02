import { bandForValue, smvPerHour } from './scheme'
import { Operative, PayElementType } from '@/models'

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

    describe('when an operative is full-time', () => {
      it('returns the correct band', () => {
        expect(bandForValue(payBands, 0, 1)).toBe(1)
        expect(bandForValue(payBands, 1000, 1)).toBe(1)
        expect(bandForValue(payBands, 2500, 1)).toBe(1)
        expect(bandForValue(payBands, 2772, 1)).toBe(2)
        expect(bandForValue(payBands, 3000, 1)).toBe(2)
        expect(bandForValue(payBands, 3132, 1)).toBe(3)
        expect(bandForValue(payBands, 3200, 1)).toBe(3)
        expect(bandForValue(payBands, 3366, 1)).toBe(4)
        expect(bandForValue(payBands, 3500, 1)).toBe(4)
        expect(bandForValue(payBands, 3618, 1)).toBe(5)
        expect(bandForValue(payBands, 3700, 1)).toBe(5)
        expect(bandForValue(payBands, 3888, 1)).toBe(6)
        expect(bandForValue(payBands, 4000, 1)).toBe(6)
        expect(bandForValue(payBands, 4182, 1)).toBe(7)
        expect(bandForValue(payBands, 4300, 1)).toBe(7)
        expect(bandForValue(payBands, 4494, 1)).toBe(8)
        expect(bandForValue(payBands, 4600, 1)).toBe(8)
        expect(bandForValue(payBands, 4836, 1)).toBe(9)
        expect(bandForValue(payBands, 5000, 1)).toBe(9)
        expect(bandForValue(payBands, 10000, 1)).toBe(9)
      })
    })

    describe('when an operative is part-time', () => {
      it('returns the correct band', () => {
        expect(bandForValue(payBands, 0, 0.5)).toBe(1)
        expect(bandForValue(payBands, 500, 0.5)).toBe(1)
        expect(bandForValue(payBands, 1250, 0.5)).toBe(1)
        expect(bandForValue(payBands, 1386, 0.5)).toBe(2)
        expect(bandForValue(payBands, 1500, 0.5)).toBe(2)
        expect(bandForValue(payBands, 1566, 0.5)).toBe(3)
        expect(bandForValue(payBands, 1600, 0.5)).toBe(3)
        expect(bandForValue(payBands, 1683, 0.5)).toBe(4)
        expect(bandForValue(payBands, 1750, 0.5)).toBe(4)
        expect(bandForValue(payBands, 1809, 0.5)).toBe(5)
        expect(bandForValue(payBands, 1850, 0.5)).toBe(5)
        expect(bandForValue(payBands, 1944, 0.5)).toBe(6)
        expect(bandForValue(payBands, 2000, 0.5)).toBe(6)
        expect(bandForValue(payBands, 2091, 0.5)).toBe(7)
        expect(bandForValue(payBands, 2150, 0.5)).toBe(7)
        expect(bandForValue(payBands, 2247, 0.5)).toBe(8)
        expect(bandForValue(payBands, 2300, 0.5)).toBe(8)
        expect(bandForValue(payBands, 2418, 0.5)).toBe(9)
        expect(bandForValue(payBands, 2500, 0.5)).toBe(9)
        expect(bandForValue(payBands, 5000, 0.5)).toBe(9)
      })
    })
  })

  describe('smvPerHour', () => {
    const operative = new Operative({
      id: '123456',
      name: 'Alex Cable',
      trade: { id: 'EL', description: 'Electrical' },
      scheme: {
        type: 'SMV',
        description: 'Planned',
        conversionFactor: 1,
        payBands: [
          { band: 1, value: 2160 },
          { band: 2, value: 2700 },
          { band: 3, value: 3132 },
          { band: 4, value: 3348 },
          { band: 5, value: 3564 },
          { band: 6, value: 3780 },
          { band: 7, value: 3996 },
          { band: 8, value: 4320 },
          { band: 9, value: 4644 },
        ],
      },
      section: 'R3007',
      salaryBand: 5,
      utilisation: 1,
      fixedBand: false,
      isArchived: false,
    })

    const dayworks = new PayElementType({
      id: 101,
      description: 'Dayworks',
      payAtBand: false,
      paid: true,
      nonProductive: true,
      productive: false,
      adjustment: false,
      outOfHours: false,
      overtime: false,
      selectable: true,
      smvPerHour: null,
    })

    const holiday = new PayElementType({
      id: 102,
      description: 'Annual Leave',
      payAtBand: true,
      paid: true,
      nonProductive: true,
      productive: false,
      adjustment: false,
      outOfHours: false,
      overtime: false,
      selectable: true,
      smvPerHour: null,
    })

    const apprentice = new PayElementType({
      id: 132,
      description: 'Apprentice',
      payAtBand: true,
      paid: true,
      nonProductive: true,
      productive: false,
      adjustment: false,
      outOfHours: false,
      overtime: false,
      selectable: true,
      smvPerHour: 60,
    })

    describe('when the pay element type is paid', () => {
      it('returns the band 3 rate', () => {
        expect(smvPerHour(operative, dayworks)).toBe(87)
      })
    })

    describe('when the pay element type is paid at band', () => {
      it('returns the salary band rate', () => {
        expect(smvPerHour(operative, holiday)).toBe(99)
      })
    })

    describe('when the pay element type has a custom rate', () => {
      it('returns the custom rate', () => {
        expect(smvPerHour(operative, apprentice)).toBe(60)
      })
    })
  })
})
