import { promises as fs } from 'fs'

import frontMatter from 'front-matter'
import LRU from 'lru-cache'

import resolveBlogPost from '@/services/blog/resolve-blog-post'
import { Maybe, BlogPost, BlogPostFrontMatter } from '@/types'

const blogPostsCache = new LRU<string, BlogPost>({
  max: 512 * 1024, // 512KB
  maxAge: 60 * 60 * 1000, // 1h
})

const getBlogPost = async (
  slug: string,
  locale: string
): Promise<Maybe<BlogPost>> => {
  const filePath = await resolveBlogPost(slug, locale)
  if (!filePath) {
    return null
  }
  const cache = blogPostsCache.get(filePath)
  if (cache && process.env.NODE_ENV === 'production') {
    return cache
  }
  const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' })
  const { attributes, body } = frontMatter<BlogPostFrontMatter>(fileContent)
  const post = {
    slug,
    locale,
    content: body,
    ...attributes,
  }
  blogPostsCache.set(filePath, post)
  return post
}

export default getBlogPost
