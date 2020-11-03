type Falsy = null | undefined | 0 | ''
type Maybe<T> = T | null
type MaybeArray<T> = T | T[]
type Nullish = null | undefined

const isFalsy = <T = unknown>(x: T | Falsy): x is Falsy => !x
const isNotFalsy = <T = unknown>(x: T | Falsy): x is T => Boolean(x)

export type { Maybe, MaybeArray, Nullish }
export { isFalsy, isNotFalsy }
