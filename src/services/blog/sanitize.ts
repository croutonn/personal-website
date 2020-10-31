import { Maybe, MaybeArray, Order, OrderBy } from '@/types'

const toSingleValue = <T = unknown>(value: T | Array<T>): Maybe<T> => {
  if (Array.isArray(value)) {
    return value.length ? value[0] : null
  }
  return value
}

const sanitizeOrder = (value: Maybe<MaybeArray<string>>): Order => {
  const singleValue = toSingleValue(value)
  switch (singleValue) {
    case 'ASC':
    case 'DESC':
      return singleValue
    default:
      return 'DESC'
  }
}

const sanitizeOrderBy = (value: Maybe<MaybeArray<string>>): OrderBy => {
  const singleValue = toSingleValue(value)
  switch (singleValue) {
    case 'date':
      return singleValue
    default:
      return 'date'
  }
}

const sanitizeInt = (
  value: Maybe<MaybeArray<string | number>>,
  defaultValue: number
): number => {
  const singleValue = toSingleValue(value)
  return typeof singleValue === 'string'
    ? parseInt(singleValue, 10)
    : singleValue || defaultValue
}

const sanitizeLocale = (value: Maybe<MaybeArray<string>>): string => {
  const singleValue = toSingleValue(value)
  switch (singleValue) {
    case 'ja-JP':
    case 'en-US':
      return singleValue
    case 'ja':
      return 'ja-JP'
    case 'en':
      return 'en-US'
    default:
      return process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string
  }
}

export {
  sanitizeOrder,
  sanitizeOrderBy,
  sanitizeInt,
  sanitizeLocale,
  toSingleValue,
}
