import { DefaultSeo } from 'next-seo'
import getConfig from 'next/config'
import { AppType } from 'next/dist/next-server/lib/utils'

import { DefaultLayout } from '@/layouts'
import { Page, PublicRuntimeConfig } from '@/types'
import { I18nextProvider, useSSR } from 'react-i18next'
import i18n, { routeToLocale } from '@/lib/i18n'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { removeRootDirPath, removeTrailingSlash } from '@/lib/string-utils'
import Head from 'next/head'

const { publicRuntimeConfig } = getConfig() as {
  publicRuntimeConfig: PublicRuntimeConfig
}

const App: AppType = (props) => {
  const Layout = (props.Component as Page).layout || DefaultLayout
  const router = useRouter()
  const locale = useMemo(() => routeToLocale(router.asPath), [router.asPath])

  // Render the translation on the server side
  useSSR(props.pageProps.i18n, locale)

  const {
    publicRuntimeConfig: { i18n: i18nPublicConfig },
  } = getConfig<PublicRuntimeConfig>()

  // whether the route is `/${defaultLocale}/...`
  const isNotCanonicalPage = useMemo(
    () => router.query.locale === i18nPublicConfig.defaultLocale,
    [router.query.locale, i18nPublicConfig.defaultLocale]
  )

  // URL with `/${defaultLocale}` removed
  const canonicalUrl = useMemo(
    () =>
      !isNotCanonicalPage
        ? ''
        : `${removeTrailingSlash(router.basePath)}${removeRootDirPath(
            router.asPath
          )}` || '/',
    [isNotCanonicalPage, router.asPath, router.basePath]
  )

  // Redirect when a non canonical page is accessed
  useEffect(() => {
    if (isNotCanonicalPage) {
      router.replace(canonicalUrl)
    }
  }, [isNotCanonicalPage, canonicalUrl, router])

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <I18nextProvider i18n={i18n}>
      <Layout>
        {isNotCanonicalPage && (
          <Head>
            <link rel="canonical" href={canonicalUrl} />
          </Head>
        )}
        <DefaultSeo {...publicRuntimeConfig.seo} />
        <props.Component {...props.pageProps} />
      </Layout>
    </I18nextProvider>
  )
  /* eslint-enable react/jsx-props-no-spreading */
}

export default App
