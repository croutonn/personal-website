import { GetStaticProps, GetStaticPaths } from 'next'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'

import { useSEO } from '@/hooks'
import { Authors } from '@/lib/constants'
import markdownToReactNode from '@/lib/markdown'
import { getBlogPost, getBlogPostRoutes } from '@/services/blog'
import {
  BlogPost,
  isFalsy,
  Locale,
  Page,
  PageParams,
  PageProps,
  PublicRuntimeConfig,
  ServerRuntimeConfig,
} from '@/types'
import { getI18nStaticProps } from '@/lib/i18n'
import getConfig from 'next/config'

type BlogPostPageParams = PageParams<{
  slug: string
}>

type BlogPostPageProps = PageProps<{
  slug: string
  post: BlogPost
  notFoundLocales: string[]
  locale: Locale
  defaultLocale: Locale
}>

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

const getStaticPaths: GetStaticPaths<BlogPostPageParams> = async (context) => {
  const blogRoutes = await getBlogPostRoutes()

  const paths: { locale: string; params: BlogPostPageParams }[] = []
  blogRoutes.forEach((slug) => {
    ;(context.locales || []).forEach((locale) => {
      paths.push({
        locale,
        params: { slug },
      })
    })
  })

  return {
    paths,
    fallback: false,
  }
}

const getStaticProps: GetStaticProps<
  BlogPostPageProps,
  BlogPostPageParams
> = async (context) => {
  if (!context.params?.slug) {
    throw new Error('Missing `slug` parameter.')
  }

  const pageLocale = context.params.locale as Locale

  const { props: baseProps } = await getI18nStaticProps({
    locale: pageLocale,
    namespaces: ['common', 'blog'],
  })

  const { publicRuntimeConfig, serverRuntimeConfig } = getConfig<
    PublicRuntimeConfig,
    ServerRuntimeConfig
  >()

  const pageSlug = context.params.slug
  const { locales, defaultLocale } = publicRuntimeConfig.i18n
  const localePosts = await Promise.all(
    locales.map((locale) => getBlogPost(pageSlug, locale))
  )
  const post =
    localePosts.find((localePost) => localePost?.locale === pageLocale) ??
    (localePosts.find(
      (localePost) => localePost?.locale === defaultLocale
    ) as BlogPost)

  return {
    props: {
      ...baseProps,
      slug: context.params.slug,
      locale: pageLocale,
      defaultLocale,
      post,
      notFoundLocales: localePosts
        .filter(isFalsy)
        .map((_, index) => locales[index]),
    },
  }
}

export default BlogPostPage
export { getStaticPaths, getStaticProps }
export type { BlogPostPageParams, BlogPostPageProps }
