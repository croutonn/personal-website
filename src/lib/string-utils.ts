const TRAILING_SLASH_PATTERN = /\/$/u

const removeRootDirPath = (str: string): string =>
  `/${str.split('/').slice(2).join('/')}`

const removeTrailingSlash = (str: string): string =>
  str.replace(TRAILING_SLASH_PATTERN, '')

export { removeRootDirPath, removeTrailingSlash }
