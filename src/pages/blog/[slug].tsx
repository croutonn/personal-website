import { GetStaticProps, GetStaticPaths } from 'next'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'

import { useSEO } from '@/hooks'
import { Authors } from '@/lib/constants'
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
import { useRouter } from 'next/router'
import Head from 'next/head'
import generateCanonicalURL from '@/lib/generate-canonical-url'
import Post from '@/components/organisms/Post'

type BlogPostPageParams = PageParams<{
  slug: string
}>

type BlogPostPageProps = PageProps<{
  slug: string
  post: BlogPost
  notFoundLocales: string[]
  locale: Locale
}>

const BlogPostPage: Page<BlogPostPageProps> = (props) => {
  const {
    publicRuntimeConfig: {
      site: { url: siteUrl },
      i18n: { defaultLocale },
    },
  } = getConfig<PublicRuntimeConfig>()
  const router = useRouter()

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

  const isFallbackContent = useMemo(
    () => props.locale !== props.post.locale && props.locale !== defaultLocale,
    [props.locale, props.post.locale, defaultLocale]
  )
  const canonicalUrl = useMemo(
    () => generateCanonicalURL(router, props.notFoundLocales),
    [router, props.notFoundLocales]
  )

  return (
    <>
      {isFallbackContent && (
        <Head>
          <link rel="canonical" href={canonicalUrl} />
        </Head>
      )}
      <NextSeo {...seo} />
      <Post post={props.post} />
    </>
  )
}

const getStaticPaths: GetStaticPaths<BlogPostPageParams> = async () => {
  const {
    publicRuntimeConfig: {
      i18n: { defaultLocale },
    },
  } = getConfig<PublicRuntimeConfig, ServerRuntimeConfig>()

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
  const {
    publicRuntimeConfig: {
      i18n: { locales, defaultLocale },
    },
  } = getConfig<PublicRuntimeConfig, ServerRuntimeConfig>()

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

const getStaticProps: GetStaticProps<BlogPostPageProps, BlogPostPageParams> = (
  context
) => {
  const {
    publicRuntimeConfig: {
      i18n: { defaultLocale },
    },
  } = getConfig<PublicRuntimeConfig, ServerRuntimeConfig>()
  return createGetStaticProps(defaultLocale)(context)
}

export default BlogPostPage
export { createGetStaticProps, getStaticPaths, getStaticProps }
export type { BlogPostPageParams as Params, BlogPostPageProps as Props }
