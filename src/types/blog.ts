import type { Authors } from '@/lib/constants'
import type { ILocale } from '@/types'

type IOrder = 'ASC' | 'DESC'
type IOrderBy = 'date'

interface IGetBlogPostOptions {
  slug: string
  locale: string
}

interface IGetBlogPostPreviewsOptions {
  order?: IOrder
  orderBy?: IOrderBy
  page?: number
  perPage?: number
  locale?: string
}

interface IBlogPostFrontMatter {
  title: string
  description: string
  author: keyof typeof Authors
  publishedAt: number
  updatedAt?: number
  image?: string | string[]
  ogImage?: {
    title?: string
    subtitle?: string
    fileName: string
    imageUrl?: string
  }
  thumbnail?: string
}

interface IBlogPostPreview extends IBlogPostFrontMatter {
  id: string
  slug: string
  locale: ILocale
}

interface IBlogPost extends IBlogPostPreview {
  content: string
}

export type {
  IBlogPost,
  IBlogPostFrontMatter,
  IBlogPostPreview,
  IGetBlogPostOptions,
  IGetBlogPostPreviewsOptions,
  IOrder,
  IOrderBy,
}
