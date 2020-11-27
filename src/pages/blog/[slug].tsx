import type { GetStaticProps, GetStaticPaths } from 'next'
import { NextSeo } from 'next-seo'
import getConfig from 'next/config'

import Post from '@/components/organisms/Post'
import { useSEO } from '@/hooks'
import { getBlogPosts } from '@/lib/blog'
import { Authors } from '@/lib/constants'
import { getI18nStaticProps } from '@/lib/i18n'
import type {
  IBlogPost,
  ILocale,
  IPage,
  IPageParams,
  IPageProps,
} from '@/types'

type IBlogPostPageParams = IPageParams<{
  slug: string
}>

type IBlogPostPageProps = IPageProps<{
  slug: string
  post: IBlogPost
  notFoundLocales: string[]
  locale: ILocale
}>

const BlogPostPage: IPage<IBlogPostPageProps> = (props) => {
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
      <Post post={props.post} />
    </>
  )
}

const getStaticPaths: GetStaticPaths<IBlogPostPageParams> = async () => {
  const {
    publicRuntimeConfig: {
      i18n: { defaultLocale },
    },
  } = getConfig()

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
  targetLocale: ILocale
): GetStaticProps<IBlogPostPageProps, IBlogPostPageParams> => {
  const {
    publicRuntimeConfig: {
      i18n: { locales, defaultLocale },
    },
  } = getConfig()

  const getStaticProps: GetStaticProps<
    IBlogPostPageProps,
    IBlogPostPageParams
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
    const notFoundLocales = locales.filter(
      (locale) => !posts.find((post) => post.locale === locale)
    )
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

const getStaticProps: GetStaticProps<
  IBlogPostPageProps,
  IBlogPostPageParams
> = (context) => {
  const {
    publicRuntimeConfig: {
      i18n: { defaultLocale },
    },
  } = getConfig()
  return createGetStaticProps(defaultLocale)(context)
}

export default BlogPostPage
export { createGetStaticProps, getStaticPaths, getStaticProps }
export type { IBlogPostPageParams as IParams, IBlogPostPageProps as IProps }
