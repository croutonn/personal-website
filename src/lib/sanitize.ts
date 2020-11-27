import type { Maybe, MaybeArray, IOrder, IOrderBy } from '@/types'

const toSingleValue = <T = unknown>(value: T | Array<T>): Maybe<T> => {
  if (Array.isArray(value)) {
    return value.length ? value[0] : null
  }
  return value
}

const sanitizeOrder = (value: Maybe<MaybeArray<string>>): IOrder => {
  const singleValue = toSingleValue(value)
  switch (singleValue) {
    case 'ASC':
    case 'DESC':
      return singleValue
    default:
      return 'DESC'
  }
}

const sanitizeOrderBy = (value: Maybe<MaybeArray<string>>): IOrderBy => {
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

export { sanitizeOrder, sanitizeOrderBy, sanitizeInt, toSingleValue }
