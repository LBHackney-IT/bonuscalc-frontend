export const wrap = (number, max) => {
  return ((((number - 1) % max) + max) % max) + 1
}

export const numberWithPrecision = (number, precision) => {
  return number.toLocaleString('en-GB', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
}
