import getConfig from 'next/config'

import client from '@/services/github/client'
import type {
  IGetDirectoriesWithFilesQuery,
  IGetFileQuery,
} from '@/services/github/graphql'
import { isNotFalsy } from '@/types'
import type {
  IBlogPost,
  IBlogPostFrontMatter,
  IBlogPostPreview,
  IHastNode,
  ILocale,
  Maybe,
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
): Maybe<{ attributes: IBlogPostFrontMatter; body: IHastNode }> => {
  if (!text) return null
  let json: {
    attributes: IBlogPostFrontMatter
    body: IHastNode
  }
  try {
    json = JSON.parse(text)
  } catch (_) {
    return null
  }
  const normalizedFrontMatter = {
    ...json.attributes,
    publishedAt: new Date(json.attributes.publishedAt).getTime(),
    updatedAt: json.attributes.updatedAt
      ? new Date(json.attributes.updatedAt).getTime()
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
    body: json.body,
    attributes: normalizedFrontMatter,
  }
}

const convertToPosts = (
  queryResult: IGetDirectoriesWithFilesQuery
): IBlogPost[] => {
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
  } = getConfig()

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
        if (
          file.object?.__typename !== 'Blob' ||
          !file.name.endsWith('.json')
        ) {
          return null
        }

        const postData = readPostData(file.object.text)
        if (!postData) return null

        return {
          id: file.object.id,
          // filename to locale
          locale: (file.name.split('.').slice(-2)[0] ||
            defaultLocale) as ILocale,
          slug,
          content: postData.body,
          ...postData.attributes,
        }
      })
    })
    .flat()
    .filter(isNotFalsy)
    .sort(compareByDescDate)
}

const convertToPost = (
  queryResult: IGetFileQuery,
  postInfo: { slug: string; locale: ILocale }
): Maybe<IBlogPost> => {
  if (
    !queryResult ||
    !queryResult.repository ||
    !queryResult.repository.object ||
    queryResult.repository.object.__typename !== 'Blob'
  ) {
    return null
  }
  const postData = readPostData(queryResult.repository.object.text)
  if (!postData) return null

  return {
    id: queryResult.repository.object.id,
    content: postData.body,
    ...postData.attributes,
    ...postInfo,
  }
}

const blogPostsCache: IBlogPost[] = []
const getBlogPosts = async (): Promise<IBlogPost[]> => {
  if (blogPostsCache.length > 0) return blogPostsCache

  const {
    serverRuntimeConfig: { blog: blogConfig },
  } = getConfig()
  const response = await client.GetDirectoriesWithFiles({
    owner: blogConfig.repository.owner,
    name: blogConfig.repository.name,
    expression: `${blogConfig.repository.branch}:${blogConfig.repository.directory}`,
  })
  const posts = convertToPosts(response)
  blogPostsCache.push(...posts)
  return posts
}

const postToPostPreview = (post: IBlogPost): IBlogPostPreview => {
  const postPreview: IBlogPostPreview & {
    content?: IBlogPost['content']
  } = {
    ...post,
  }
  delete postPreview.content
  return postPreview
}

export { convertToPost, convertToPosts, getBlogPosts, postToPostPreview }
