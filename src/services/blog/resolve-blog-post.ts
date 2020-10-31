import { promises as fs } from 'fs'
import { join } from 'path'

import appRootPath from 'app-root-path'
import LRU from 'lru-cache'

import { Maybe } from '@/types'

const resolvedCache = new LRU<string, Maybe<string>>({
  max: 128 * 1024, // 128KB
  maxAge: 60 * 60 * 1000, // 1h
})

const blogDirectoryPath = appRootPath.resolve(
  `/${process.env.CONTENT_DIRECTORY as string}/${
    process.env.CONTENT_BLOG_DIRECTORY as string
  }`
)

const resolveBlogPost = async (
  slug: string,
  locale: string
): Promise<Maybe<string>> => {
  const cacheKey = `${slug}-${locale}`
  const cache = resolvedCache.get(cacheKey)
  if (cache !== undefined) {
    return cache
  }
  const candidatePaths = [
    join(blogDirectoryPath, `${slug}/${slug}_${locale}.md`),
  ]
  if (locale === (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string)) {
    candidatePaths.push(
      join(
        blogDirectoryPath,
        `${slug}/${slug}_${process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string}.md`
      ),
      join(blogDirectoryPath, `${slug}.md`),
      join(blogDirectoryPath, `${slug}/${slug}.md`)
    )
  }
  const stats = await Promise.all(
    candidatePaths.map((filePath) => fs.stat(filePath).catch(() => null))
  )
  const resolvedIndex = stats.findIndex((stat) => stat && stat.isFile())
  const resolvedPath =
    resolvedIndex === -1 ? null : candidatePaths[resolvedIndex]
  resolvedCache.set(cacheKey, resolvedPath)
  return resolvedPath
}

export default resolveBlogPost
