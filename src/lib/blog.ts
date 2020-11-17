import getConfig from 'next/config'

import { readMarkdown } from '@/lib/markdown'
import client from '@/services/github/client'
import {
  GetDirectoriesWithFilesQuery,
  GetFileQuery,
} from '@/services/github/graphql'
import {
  BlogPost,
  BlogPostFrontMatter,
  BlogPostPreview,
  isNotFalsy,
  Locale,
  Maybe,
  PublicRuntimeConfig,
  ServerRuntimeConfig,
} from '@/types'

const compareByDescDate = <
  A extends { publishedAt: number; updatedAt?: number }
>(
  a: A,
  b: A
) => {
  const adate = a.updatedAt || a.publishedAt
  const bdate = b.updatedAt || b.publishedAt
  return bdate - adate
}

const readPostData = (
  text: Maybe<string>
): Maybe<{ frontMatter: BlogPostFrontMatter; body: string }> => {
  if (!text) return null
  const markdownData = readMarkdown<
    Omit<BlogPostFrontMatter, 'publishedAt' | 'updatedAt'> & {
      publishedAt: string
      updatedAt?: string
    }
  >(text)
  if (!markdownData) {
    return null
  }
  const normalizedFrontMatter = {
    ...markdownData.attributes,
    publishedAt: new Date(markdownData.attributes.publishedAt).getTime(),
    updatedAt: markdownData.attributes.updatedAt
      ? new Date(markdownData.attributes.updatedAt).getTime()
      : undefined,
  }
  if (!normalizedFrontMatter.updatedAt) {
    delete normalizedFrontMatter.updatedAt
  }
  if (normalizedFrontMatter?.ogImage?.title) {
    delete normalizedFrontMatter.ogImage.title
  }
  if (normalizedFrontMatter?.ogImage?.subtitle) {
    delete normalizedFrontMatter.ogImage.subtitle
  }
  if (normalizedFrontMatter?.ogImage?.imageUrl) {
    delete normalizedFrontMatter.ogImage.imageUrl
  }
  return {
    body: markdownData.body,
    frontMatter: normalizedFrontMatter,
  }
}

const convertToPosts = (
  queryResult: GetDirectoriesWithFilesQuery
): BlogPost[] => {
  if (
    !queryResult.repository ||
    !queryResult.repository.object ||
    queryResult.repository.object.__typename !== 'Tree' ||
    !queryResult.repository.object.entries
  ) {
    return []
  }

  const {
    publicRuntimeConfig: {
      i18n: { defaultLocale },
    },
  } = getConfig<PublicRuntimeConfig>()

  return queryResult.repository.object.entries
    .map((directory) => {
      if (
        directory.object?.__typename !== 'Tree' ||
        !directory.object.entries
      ) {
        return null
      }
      const slug = directory.name
      return directory.object.entries.map((file) => {
        if (file.object?.__typename !== 'Blob') {
          return null
        }

        const postData = readPostData(file.object.text)
        if (!postData) return null

        return {
          id: file.object.id,
          // filename to locale
          locale: (file.name.split('.').slice(-2)[0] ||
            defaultLocale) as Locale,
          slug,
          content: postData.body,
          ...postData.frontMatter,
        }
      })
    })
    .flat()
    .filter(isNotFalsy)
    .sort(compareByDescDate)
}

const convertToPost = (
  queryResult: GetFileQuery,
  postInfo: { slug: string; locale: Locale }
): Maybe<BlogPost> => {
  if (
    !queryResult ||
    !queryResult.repository ||
    !queryResult.repository.object ||
    queryResult.repository.object.__typename !== 'Blob'
  ) {
    return null
  }
  const content = queryResult.repository.object.text || ''
  const postData = readMarkdown<BlogPostFrontMatter>(content)
  if (!postData) return null

  return {
    id: queryResult.repository.object.id,
    content: postData.body,
    ...postData.attributes,
    ...postInfo,
  }
}

const blogPostsCache: BlogPost[] = []
const getBlogPosts = async (): Promise<BlogPost[]> => {
  if (blogPostsCache.length > 0) return blogPostsCache

  const {
    serverRuntimeConfig: { blog: blogConfig },
  } = getConfig<PublicRuntimeConfig, ServerRuntimeConfig>()
  const response = await client.GetDirectoriesWithFiles({
    owner: blogConfig.repository.owner,
    name: blogConfig.repository.name,
    expression: `${blogConfig.repository.branch}:${blogConfig.repository.directory}`,
  })
  const posts = convertToPosts(response)
  blogPostsCache.push(...posts)
  return posts
}

const postToPostPreview = (post: BlogPost): BlogPostPreview => {
  const postPreview: BlogPostPreview & {
    content?: BlogPost['content']
  } = {
    ...post,
  }
  delete postPreview.content
  return postPreview
}

export { convertToPost, convertToPosts, getBlogPosts, postToPostPreview }
