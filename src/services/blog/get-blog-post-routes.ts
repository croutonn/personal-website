import { readdirSync } from 'fs'

import appRootPath from 'app-root-path'

import {
  LOCALE_PATTERN,
  MARKDOWN_FILE_EXTENSION_PATTERN,
} from '@/services/blog/utils'

const blogDirectoryPath = appRootPath.resolve(
  `/${process.env.CONTENT_DIRECTORY as string}/${
    process.env.CONTENT_BLOG_DIRECTORY as string
  }`
)

const getBlogPostRoutes = (): string[] => {
  const directoryItems = readdirSync(blogDirectoryPath, { encoding: 'utf-8' })
  const blogRoutes = new Set<string>()
  directoryItems.forEach((item) => {
    blogRoutes.add(
      item
        .replace(MARKDOWN_FILE_EXTENSION_PATTERN, '')
        .replace(LOCALE_PATTERN, '')
    )
  })

  return Array.from(blogRoutes)
}

export default getBlogPostRoutes
