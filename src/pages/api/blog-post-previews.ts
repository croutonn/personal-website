import { NextApiHandler } from 'next'

import {
  getAllBlogPostPreviews,
  sanitizeInt,
  sanitizeLocale,
  sanitizeOrder,
  sanitizeOrderBy,
} from '@/services/blog'
import { BlogPostPreview, GetBlogPostPreviewsOptions } from '@/types'

type ResponseBodyType = unknown

type BlogPostPreviewsHandlerOptions = Required<GetBlogPostPreviewsOptions>

const blogPostPreviewsHandler: NextApiHandler<ResponseBodyType> = async (
  request,
  response
) => {
  const options: BlogPostPreviewsHandlerOptions = {
    order: sanitizeOrder(request.query.order),
    orderBy: sanitizeOrderBy(request.query.orderBy),
    page: sanitizeInt(request.query.page, 1),
    perPage: sanitizeInt(request.query.perPage, 10),
    locale: sanitizeLocale(request.query.locale),
  }

  const blogPostPreviews = await getAllBlogPostPreviews()
  const localedBlogPostPreviews: BlogPostPreview[] = []
  blogPostPreviews.forEach((post) => {
    localedBlogPostPreviews.push(
      post[options.locale]
        ? post[options.locale]
        : post[process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string]
    )
  })

  if (options.orderBy === 'date') {
    localedBlogPostPreviews.sort((a, b) => {
      const adate = new Date(a.updatedAt || a.publishedAt).getTime()
      const bdate = new Date(b.updatedAt || b.publishedAt).getTime()
      if (options.order === 'DESC') {
        return bdate - adate
      }
      return adate - bdate
    })
  }

  const offset = (options.page - 1) * options.perPage
  const pagenatedBlogPostPreviews = localedBlogPostPreviews.slice(
    offset,
    offset + options.perPage
  )

  response.status(200).json(pagenatedBlogPostPreviews)
}

export default blogPostPreviewsHandler
