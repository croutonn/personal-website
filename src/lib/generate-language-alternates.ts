import { NextSeoProps } from 'next-seo'
import getConfig from 'next/config'
import { NextRouter } from 'next/router'

import removeTrailingSlash from '@/lib/remove-trailing-slash'
import { PublicRuntimeConfig } from '@/types'

const { publicRuntimeConfig } = getConfig() as {
  publicRuntimeConfig: PublicRuntimeConfig
}

const generateLanguageAlternates = (
  router: NextRouter
): NextSeoProps['languageAlternates'] => {
  const { url } = publicRuntimeConfig.site
  const { defaultLocale, asPath, basePath, locale } = router
  const normalizedBasePath = removeTrailingSlash(basePath)
  return (router.locales || [])
    .filter((hrefLang) => locale !== hrefLang)
    .map((hrefLang) => {
      const href =
        hrefLang === defaultLocale
          ? `${url}${normalizedBasePath}${asPath}`
          : `${url}${normalizedBasePath}/${hrefLang}${asPath}`
      return { href, hrefLang }
    })
}

export default generateLanguageAlternates
