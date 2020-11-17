import { GetStaticProps, GetStaticPaths } from 'next'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'

import { useSEO } from '@/hooks'
import { Authors } from '@/lib/constants'
import { markdownToReactNode } from '@/lib/markdown'
import {
  BlogPost,
  Locale,
  Page,
  PageParams,
  PageProps,
  PublicRuntimeConfig,
  ServerRuntimeConfig,
} from '@/types'
import { getI18nStaticProps } from '@/lib/i18n'
import getConfig from 'next/config'
import { getBlogPosts } from '@/lib/blog'

type BlogPostPageParams = PageParams<{
  slug: string
}>

type BlogPostPageProps = PageProps<{
  slug: string
  post: BlogPost
  notFoundLocales: string[]
  locale: Locale
}>

const {
  publicRuntimeConfig: {
    i18n: { locales, defaultLocale },
  },
} = getConfig<PublicRuntimeConfig, ServerRuntimeConfig>()

const BlogPostPage: Page<BlogPostPageProps> = (props) => {
  const postContent = useMemo(() => markdownToReactNode(props.post.content), [
    props.post.content,
  ])

  const seo = useSEO(
    {
      title: props.post.title,
      description: props.post.description,
      openGraph: {
        type: 'article',
      },
      twitter: {
        handle: `@${Authors[props.post.author].twitter}`,
      },
    },
    props.notFoundLocales
  )

  return (
    <>
      <NextSeo {...seo} />
      <article>
        <header>
          <h1>{props.post.title}</h1>
        </header>
        <div>{postContent}</div>
      </article>
    </>
  )
}

const getStaticPaths: GetStaticPaths<BlogPostPageParams> = async () => {
  const posts = await getBlogPosts()
  const slugs = new Set<string>()

  posts.forEach((post) => slugs.add(post.slug))

  const paths = Array.from(slugs)
    .map((slug) => ({
      params: { slug, locale: defaultLocale },
    }))
    .flat()

  return {
    paths,
    fallback: false,
  }
}

const createGetStaticProps = (
  targetLocale: Locale
): GetStaticProps<BlogPostPageProps, BlogPostPageParams> => {
  const getStaticProps: GetStaticProps<
    BlogPostPageProps,
    BlogPostPageParams
  > = async (context) => {
    if (!context.params) {
      throw new Error('Missing parameter.')
    }

    const { slug: pageSlug, locale: pageLocale = targetLocale } = context.params
    const { props: baseProps } = await getI18nStaticProps({
      locale: pageLocale,
      namespaces: ['common', 'blog'],
    })
    const posts = (await getBlogPosts()).filter(
      (post) => post.slug === pageSlug
    )
    const pagePost = posts.find((post) => post.locale === targetLocale)
    const notFoundLocales = locales.filter((locale) => {
      !posts.find((post) => post.locale === locale)
    })
    const props = {
      ...baseProps,
      slug: context.params.slug,
      locale: pageLocale,
      notFoundLocales,
    }

    if (pagePost) {
      return {
        props: {
          ...props,
          post: pagePost,
        },
      }
    }

    if (targetLocale === defaultLocale) {
      throw new Error(`\`${pageSlug}\` has no post in default locale`)
    }

    const fallbackPost = posts.find((post) => post.locale === defaultLocale)

    if (!fallbackPost) {
      throw new Error(`\`${pageSlug}\` has no post in default locale`)
    }

    return {
      props: {
        ...props,
        post: fallbackPost,
      },
    }
  }
  return getStaticProps
}

const getStaticProps = createGetStaticProps(defaultLocale)

export default BlogPostPage
export { createGetStaticProps, getStaticPaths, getStaticProps }
export type { BlogPostPageParams as Params, BlogPostPageProps as Props }
