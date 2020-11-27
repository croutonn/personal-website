import type { NextSeoProps } from 'next-seo'
import getConfig from 'next/config'
import type { NextRouter } from 'next/router'

import { routeToLocale } from '@/lib/i18n'
import removeTrailingSlash from '@/lib/remove-trailing-slash'

const generateLanguageAlternates = (
  router: NextRouter
): NextSeoProps['languageAlternates'] => {
  const {
    publicRuntimeConfig: {
      i18n: { defaultLocale, locales },
      site: { url: siteUrl },
    },
  } = getConfig()
  const { asPath, basePath } = router
  const normalizedBasePath = removeTrailingSlash(basePath)
  const locale = routeToLocale(asPath)
  return locales
    .filter((hrefLang) => locale !== hrefLang)
    .map((hrefLang) => {
      const href =
        hrefLang === defaultLocale
          ? `${siteUrl}${normalizedBasePath}${asPath}`
          : `${siteUrl}${normalizedBasePath}/${hrefLang}${asPath}`
      return { href, hrefLang }
    })
}

export default generateLanguageAlternates
