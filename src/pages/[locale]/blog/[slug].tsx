import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'

import * as BlogPostPage from '@/pages/blog/[slug]'

import getConfig from 'next/config'
import { PublicRuntimeConfig, ServerRuntimeConfig } from '@/types'
import { getBlogPosts } from '@/lib/blog'

const {
  publicRuntimeConfig: {
    i18n: { locales, defaultLocale },
  },
} = getConfig<PublicRuntimeConfig, ServerRuntimeConfig>()

const getStaticPaths: GetStaticPaths<BlogPostPage.Params> = async () => {
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
  BlogPostPage.Props,
  BlogPostPage.Params
> = (context) =>
  BlogPostPage.createGetStaticProps(context.params?.locale || defaultLocale)(
    context
  )

export default BlogPostPage.default

export { getStaticProps, getStaticPaths }
