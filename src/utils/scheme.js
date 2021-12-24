import { round } from './number'

export const smvh = (value) => {
  return round(value / 60, 10)
}

export const smvhOrUnits = (scheme, value) => {
  if (scheme?.isUnitScheme) {
    return round(value * scheme.conversionFactor, scheme.precision)
  } else {
    return round(value / 60, 10)
  }
}

export const smvOrUnits = (scheme, value) => {
  if (scheme?.isUnitScheme) {
    return round(value * scheme.conversionFactor, scheme.precision)
  } else {
    return round(value, scheme.precision)
  }
}

export const calculateSMV = (operative, payElementType, duration) => {
  if (payElementType.productive) {
    return round(duration * 60, 4)
  } else {
    return round(duration * smvPerHour(operative, payElementType), 4)
  }
}

export const smvPerHour = (operative, payElementType) => {
  if (payElementType.smvPerHour) {
    return payElementType.smvPerHour
  } else if (payElementType.paid) {
    const payBand = operative.payBand(payElementType.payAtBand)

    if (payBand) {
      return round(payBand.value / 36, 10)
    } else {
      return 0
    }
  } else {
    return 0
  }
}

export const bandForValue = (payBands, value, utilisation) => {
  return payBands.reduce((band, payBand) => {
    return payBand.value * utilisation > value ? band : payBand.band
  }, 1)
}
