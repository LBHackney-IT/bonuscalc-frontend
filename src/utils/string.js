export const compareStrings = (a, b) => {
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  } else {
    return 0
  }
}

export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const humanize = (string) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase()
}

export const pluralize = (count, singular, plural) => {
  return count == 1 ? singular : plural
}

export const transliterate = (string) => {
  return string.normalize('NFD').replace(/[^\sa-zA-Z0-9]+/, '')
}

export const truncate = (text, length, options) => {
  const separator = options?.separator || ' '
  const omission = options?.omission || '...'

  if (text.length <= length) return text

  const lwrfo = length - omission.length
  let stop = lwrfo

  if (separator) {
    stop = text.lastIndexOf(separator, lwrfo)
  }

  return `${text.substring(0, stop)}${omission}`
}
