export const wrap = (number, max) => {
  return ((((number - 1) % max) + max) % max) + 1
}
