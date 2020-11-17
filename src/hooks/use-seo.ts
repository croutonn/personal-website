import { NextSeoProps, OpenGraph } from 'next-seo/lib/types'
import getConfig from 'next/config'
import { NextRouter, useRouter } from 'next/router'
import { useMemo } from 'react'

import generateCanonicalURL from '@/lib/generate-canonical-url'
import generateLanguageAlternates from '@/lib/generate-language-alternates'
import { Locale, PublicRuntimeConfig } from '@/types'

const { publicRuntimeConfig } = getConfig<PublicRuntimeConfig>()

const createOpenGraphConfiguration = (router: NextRouter): OpenGraph => {
  const mergedOpenGraph = {
    ...publicRuntimeConfig.seo.openGraph,
    locale: publicRuntimeConfig.i18n.localeMap[router.locale as Locale],
  }
  return mergedOpenGraph
}

const createLanguageAlternatesConfiguration = (
  router: NextRouter
): NonNullable<ReturnType<typeof generateLanguageAlternates>> => {
  const languageAlternates = generateLanguageAlternates(router) || []
  return languageAlternates
}

const useSEO = (
  seoOptions: NextSeoProps = {},
  excludeLocales: string[] = []
): NextSeoProps => {
  const router = useRouter()
  const seo = useMemo(() => {
    const title = seoOptions.title || seoOptions.openGraph?.title
    const description =
      seoOptions.description || seoOptions.openGraph?.description
    const canonical = generateCanonicalURL(router, excludeLocales)
    const openGraph = createOpenGraphConfiguration(router)
    const languageAlternates = createLanguageAlternatesConfiguration(router)
    return {
      openGraph: {
        ...openGraph,
        url: canonical,
        title: title || openGraph.title,
        description: description || openGraph.description,
      },
      languageAlternates,
      canonical,
      ...seoOptions,
      title,
      description,
    }
  }, [router, seoOptions, excludeLocales])
  return seo
}

export default useSEO
