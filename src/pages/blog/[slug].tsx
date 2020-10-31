import { GetStaticProps, GetStaticPaths } from 'next'
import getConfig from 'next/config'
import Head from 'next/head'
import { useMemo } from 'react'

import AlternateLinks from '@/components/molecules/AlternateLinks'
import DocumentMetaTags from '@/components/molecules/DocumentMetaTags'
import { Authors } from '@/lib/constants'
import markdownToReactNode from '@/lib/markdown'
import renderTitle from '@/lib/render-title'
import getBlogPost from '@/services/blog/get-blog-post'
import getBlogPostRoutes from '@/services/blog/get-blog-post-routes'
import {
  AlternateLinkData,
  isNotFalsy,
  BlogPost,
  Page,
  DocumentMetaData,
  PublicRuntimeConfig,
} from '@/types'

type BlogPostPageParams = {
  slug: string
}

type BlogPostPageProps = {
  slug: string
  locale: string
  defaultLocale: string
  post: BlogPost
  alternateLinks: AlternateLinkData[]
}

const { publicRuntimeConfig } = getConfig() as {
  publicRuntimeConfig: PublicRuntimeConfig
}

const BlogPostPage: Page<BlogPostPageProps> = (props) => {
  const isFallbacked = props.locale !== props.post.locale
  const metaData: DocumentMetaData = {
    type: 'blog',
    url: `${publicRuntimeConfig.site.url}${
      props.locale === props.defaultLocale ? '' : `/${props.locale}`
    }/blog/${props.slug}`,
    title: props.post.title,
    description: props.post.description,
    creator: Authors[props.post.author].twitter,
  }

  const postContent = useMemo(() => markdownToReactNode(props.post.content), [
    props.post.content,
  ])

  return (
    <>
      {isFallbacked && (
        <Head>
          <link rel="canonical" href={`/blog/${props.slug}`} />
        </Head>
      )}
      <Head>
        <title>{renderTitle(props.post.title)}</title>
      </Head>
      <AlternateLinks alternates={props.alternateLinks} />
      <DocumentMetaTags locale={props.locale} data={metaData} />

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
  const localePosts = await Promise.all(
    (context.locales || [pageLocale]).map((locale) =>
      getBlogPost(pageSlug, locale)
    )
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
    alternateLinks: localePosts.filter(isNotFalsy).map(
      (localePost): AlternateLinkData => ({
        href: `${publicRuntimeConfig.site.url}${
          localePost.locale === defaultLocale ? '' : `/${localePost.locale}`
        }/blog/${pageSlug}`,
        hrefLang: localePost.locale,
        title: localePost.title,
      })
    ),
  }
  return {
    props,
  }
}

export default BlogPostPage
export { getStaticPaths, getStaticProps }
