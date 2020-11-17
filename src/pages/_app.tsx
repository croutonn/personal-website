import { DefaultSeo } from 'next-seo'
import getConfig from 'next/config'
import { AppType } from 'next/dist/next-server/lib/utils'

import { DefaultLayout } from '@/layouts'
import { Page, PublicRuntimeConfig } from '@/types'
import { I18nextProvider, useSSR } from 'react-i18next'
import i18n, { LocaleProvider, routeToLocale } from '@/lib/i18n'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import generateCanonicalURL from '@/lib/generate-canonical-url'

const App: AppType = (props) => {
  const {
    publicRuntimeConfig: {
      site: { url: siteUrl },
      i18n: i18nPublicConfig,
      seo: seoDefaultConfig,
    },
  } = getConfig<PublicRuntimeConfig>()

  const Layout = (props.Component as Page).layout || DefaultLayout
  const router = useRouter()
  const locale = useMemo(() => routeToLocale(router.asPath), [router.asPath])

  // Render the translation on the server side
  useSSR(props.pageProps.i18n, locale)

  // whether the route is `/${defaultLocale}/...`
  const isNotCanonicalPage = useMemo(
    () => router.query.locale === i18nPublicConfig.defaultLocale,
    [router.query.locale, i18nPublicConfig.defaultLocale]
  )

  // URL with `/${defaultLocale}` removed
  const canonicalUrl = useMemo(
    () => (isNotCanonicalPage ? generateCanonicalURL(router) : null),
    [router, isNotCanonicalPage]
  )

  // Redirect when a non canonical page is accessed
  useEffect(() => {
    if (canonicalUrl) {
      router.replace(canonicalUrl)
    }
  }, [canonicalUrl, router])

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <LocaleProvider value={locale}>
      <I18nextProvider i18n={i18n}>
        <Layout>
          {canonicalUrl && (
            <Head>
              <link rel="canonical" href={canonicalUrl} />
            </Head>
          )}
          <DefaultSeo {...seoDefaultConfig} />
          <props.Component {...props.pageProps} />
        </Layout>
      </I18nextProvider>
    </LocaleProvider>
  )
  /* eslint-enable react/jsx-props-no-spreading */
}

export default App
