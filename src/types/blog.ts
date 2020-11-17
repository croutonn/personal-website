import { Authors } from '@/lib/constants'
import { Locale } from '@/types/i18n'

type Order = 'ASC' | 'DESC'
type OrderBy = 'date'

type GetBlogPostOptions = {
  slug: string
  locale: string
}

type GetBlogPostPreviewsOptions = {
  order?: Order
  orderBy?: OrderBy
  page?: number
  perPage?: number
  locale?: string
}

type BlogPostFrontMatter = {
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

type BlogPostPreview = BlogPostFrontMatter & {
  id: string
  slug: string
  locale: Locale
}

type BlogPost = BlogPostPreview & {
  content: string
}

export type {
  BlogPost,
  BlogPostFrontMatter,
  BlogPostPreview,
  GetBlogPostOptions,
  GetBlogPostPreviewsOptions,
  Order,
  OrderBy,
}
