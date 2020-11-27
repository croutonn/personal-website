import getConfig from 'next/config'
import type { NextRouter } from 'next/router'

import { routeToLocale } from '@/lib/i18n'
import removeTrailingSlash from '@/lib/remove-trailing-slash'
import { removeRootDirPath } from '@/lib/string-utils'

const generateCanonicalURL = (
  router: NextRouter,
  excludes: string[] = []
): string => {
  const {
    publicRuntimeConfig: {
      site: { url: siteUrl },
      i18n: { defaultLocale },
    },
  } = getConfig()

  const { asPath, basePath } = router
  const locale = routeToLocale(router)
  const normalizedBasePath = removeTrailingSlash(basePath)
  const normalizedAsPath = router.query?.locale
    ? removeRootDirPath(asPath)
    : asPath
  const localePath =
    locale === defaultLocale || excludes.find((exclude) => locale === exclude)
      ? ''
      : `/${locale}`
  const canonicalUrl = `${siteUrl}${normalizedBasePath}${localePath}${normalizedAsPath}`
  return canonicalUrl
}

export default generateCanonicalURL
