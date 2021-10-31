export const wrap = (number, max) => {
  return ((((number - 1) % max) + max) % max) + 1
}

export const numberWithPrecision = (number, precision) => {
  return number.toLocaleString('en-GB', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
}

export const sum = (total, value) => {
  const number = parseFloat(value)
  return isNaN(number) ? total : total + number
}

export const round = (number, precision) => {
  const exponent = Math.pow(10, precision)
  return Math.round((number + Number.EPSILON) * exponent) / exponent
}
