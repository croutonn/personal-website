const LOCALE_PATTERN = /_([a-z]{2})$/iu
const MARKDOWN_FILE_EXTENSION_PATTERN = /\.md$/iu

const filePathToLocale = (filePath: string): string => {
  const matcher = filePath.match(LOCALE_PATTERN)
  return matcher
    ? matcher[1]
    : (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string)
}

export { LOCALE_PATTERN, MARKDOWN_FILE_EXTENSION_PATTERN, filePathToLocale }
