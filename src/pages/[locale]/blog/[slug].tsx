import { GetStaticPaths } from 'next'

import { getI18nStaticPaths } from '@/lib/i18n'
import * as BlogPostPage from '@/pages/blog/[slug]'

const { getStaticProps } = BlogPostPage

const getStaticPaths: GetStaticPaths<BlogPostPage.BlogPostPageParams> = async (
  context
) => getI18nStaticPaths(await BlogPostPage.getStaticPaths(context))

export default BlogPostPage.default

export { getStaticProps, getStaticPaths }
