import getConfig from 'next/config'
import { NextRouter } from 'next/router'

import removeTrailingSlash from '@/lib/remove-trailing-slash'
import { PublicRuntimeConfig } from '@/types'

const { publicRuntimeConfig } = getConfig() as {
  publicRuntimeConfig: PublicRuntimeConfig
}

const generateCanonicalURL = (
  router: NextRouter,
  excludes: string[] = []
): string => {
  const { url } = publicRuntimeConfig.site
  const { asPath, locale, defaultLocale, basePath } = router
  const normalizedBasePath = removeTrailingSlash(basePath)
  const localePath =
    locale === defaultLocale || excludes.find((exclude) => locale === exclude)
      ? ''
      : `/${locale}`
  const canonicalUrl = `${url}${normalizedBasePath}${localePath}${asPath}`
  return canonicalUrl
}

export default generateCanonicalURL
