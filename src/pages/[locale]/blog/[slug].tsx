import type { GetStaticPaths, GetStaticProps } from 'next'
import getConfig from 'next/config'

import { getBlogPosts } from '@/lib/blog'
import * as BlogPostPage from '@/pages/blog/[slug]'

const getStaticPaths: GetStaticPaths<BlogPostPage.IParams> = async () => {
  const {
    publicRuntimeConfig: {
      i18n: { locales },
    },
  } = getConfig()

  const posts = await getBlogPosts()
  const slugs = new Set<string>()

  posts.forEach((post) => slugs.add(post.slug))

  const paths = Array.from(slugs)
    .map((slug) =>
      locales.map((locale) => ({
        params: { slug, locale },
      }))
    )
    .flat()

  return {
    paths,
    fallback: false,
  }
}

const getStaticProps: GetStaticProps<
  BlogPostPage.IProps,
  BlogPostPage.IParams
> = (context) => {
  const {
    publicRuntimeConfig: {
      i18n: { defaultLocale },
    },
  } = getConfig()

  return BlogPostPage.createGetStaticProps(
    context.params?.locale || defaultLocale
  )(context)
}

export default BlogPostPage.default

export { getStaticProps, getStaticPaths }
