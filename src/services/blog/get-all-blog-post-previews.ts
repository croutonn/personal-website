import { promises as fs } from 'fs'
import { cpus } from 'os'
import { basename } from 'path'

import appRootPath from 'app-root-path'
import frontMatter from 'front-matter'
import globby from 'globby'

import concurrecyPromise from '@/lib/concurrency-promise'
import { filePathToLocale, LOCALE_PATTERN } from '@/services/blog'
import { BlogPostFrontMatter, BlogPostPreview } from '@/types'

const blogDirectoryPath = appRootPath.resolve(
  `/${process.env.CONTENT_DIRECTORY as string}/${
    process.env.CONTENT_BLOG_DIRECTORY as string
  }`
)

const filePathToSlug = (filePath: string): string => {
  return basename(filePath, '.md').replace(LOCALE_PATTERN, '')
}

const readFrontMatterFromMarkdown = async <T = unknown>(
  filePath: string
): Promise<T> => {
  const content = await fs.readFile(filePath, { encoding: 'utf-8' })
  return frontMatter<T>(content).attributes
}

const blogPostPreviewsCache = new Map<string, Record<string, BlogPostPreview>>()

const getAllBlogPostPreviews = async (): Promise<
  typeof blogPostPreviewsCache
> => {
  if (blogPostPreviewsCache.size && process.env.NODE_ENV === 'production') {
    return blogPostPreviewsCache
  }

  const markdownFiles = await globby('**/*.md', {
    cwd: blogDirectoryPath,
    absolute: true,
  })
  const blogPostPreviews = await concurrecyPromise<{
    slug: string
    locale: string
    file: string
    frontMatter: BlogPostFrontMatter
  }>(
    markdownFiles.map((file) => async () => ({
      slug: filePathToSlug(file),
      locale: filePathToLocale(file),
      file,
      frontMatter: await readFrontMatterFromMarkdown<BlogPostFrontMatter>(file),
    })),
    cpus().length
  )
  blogPostPreviews.forEach((preview) => {
    const data = blogPostPreviewsCache.get(preview.slug) || {}
    data[preview.locale] = {
      slug: preview.slug,
      locale: preview.locale,
      ...preview.frontMatter,
    }
    blogPostPreviewsCache.set(preview.slug, data)
  })

  return blogPostPreviewsCache
}

export default getAllBlogPostPreviews
