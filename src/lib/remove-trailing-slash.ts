const TRAILING_SLASH_PATTERN = /\/+$/
const removeTrailingSlash = (str: string): string =>
  String(str).replace(TRAILING_SLASH_PATTERN, '')

export default removeTrailingSlash
