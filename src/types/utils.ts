type Maybe<T> = T | null
type Nullish = null | undefined
type MaybeArray<T> = T | T[]

const isNotFalsy = <T = unknown>(x: T | null | undefined | 0 | ''): x is T =>
  Boolean(x)

export type { Maybe, MaybeArray, Nullish }
export { isNotFalsy }
