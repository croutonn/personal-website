import { GetStaticProps, GetStaticPaths } from 'next'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'

import { useSEO } from '@/hooks'
import { Authors } from '@/lib/constants'
import markdownToReactNode from '@/lib/markdown'
import { getBlogPost, getBlogPostRoutes } from '@/services/blog'
import { BlogPost, isFalsy, Page } from '@/types'

type BlogPostPageParams = {
  slug: string
}

type BlogPostPageProps = {
  slug: string
  locale: string
  defaultLocale: string
  post: BlogPost
  notFoundLocales: string[]
}

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
    fallback: true,
  }
}

const getStaticProps: GetStaticProps<
  BlogPostPageProps,
  BlogPostPageParams
> = async (context) => {
  if (!context.params?.slug) {
    throw new Error('Missing `slug` parameter.')
  }
  const defaultLocale = context.defaultLocale as string
  const pageSlug = context.params.slug
  const pageLocale = context.locale || defaultLocale
  const locales = context.locales || [pageLocale]
  const localePosts = await Promise.all(
    locales.map((locale) => getBlogPost(pageSlug, locale))
  )
  const post =
    localePosts.find((localePost) => localePost?.locale === pageLocale) ??
    (localePosts.find(
      (localePost) => localePost?.locale === defaultLocale
    ) as BlogPost)

  const props: BlogPostPageProps = {
    slug: context.params.slug,
    locale: pageLocale,
    defaultLocale,
    post,
    notFoundLocales: localePosts
      .filter(isFalsy)
      .map((_, index) => locales[index]),
  }
  return {
    props,
  }
}

export default BlogPostPage
export { getStaticPaths, getStaticProps }
