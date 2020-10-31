import { Authors } from '@/lib/constants'

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
  publishedAt: string
  updatedAt?: string
  image?: string | string[]
  thumbnail?: string
}

type BlogPostPreview = BlogPostFrontMatter & {
  slug: string
  locale: string
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
