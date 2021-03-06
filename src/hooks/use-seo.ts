import type { NextSeoProps, OpenGraph } from 'next-seo/lib/types'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import type { NextRouter } from 'next/router'
import { useMemo } from 'react'

import generateCanonicalURL from '@/lib/generate-canonical-url'
import generateLanguageAlternates from '@/lib/generate-language-alternates'
import type { ILocale } from '@/types'

const createOpenGraphConfiguration = (router: NextRouter): OpenGraph => {
  const { publicRuntimeConfig } = getConfig()
  const mergedOpenGraph = {
    ...publicRuntimeConfig.seo.openGraph,
    locale: publicRuntimeConfig.i18n.localeMap[router.locale as ILocale],
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
    const canonical =
      seoOptions.canonical || generateCanonicalURL(router, excludeLocales)
    const openGraph = createOpenGraphConfiguration(router)
    const languageAlternates = createLanguageAlternatesConfiguration(router)
    return {
      canonical,
      openGraph: {
        ...openGraph,
        url: canonical,
        title: title || openGraph.title,
        description: description || openGraph.description,
      },
      languageAlternates,
      ...seoOptions,
      title,
      description,
    }
  }, [router, seoOptions, excludeLocales])
  return seo
}

export default useSEO
