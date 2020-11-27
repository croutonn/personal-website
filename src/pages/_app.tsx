import { DefaultSeo } from 'next-seo'
import getConfig from 'next/config'
import type { AppType } from 'next/dist/next-server/lib/utils'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { I18nextProvider, useSSR } from 'react-i18next'

import { DefaultLayout } from '@/layouts'
import i18n, { LocaleProvider, routeToLocale } from '@/lib/i18n'
import type { IPage } from '@/types'

const App: AppType = (props) => {
  const {
    publicRuntimeConfig: { seo: seoDefaultConfig },
  } = getConfig()

  const Layout = (props.Component as IPage).layout || DefaultLayout
  const router = useRouter()
  const locale = useMemo(() => routeToLocale(router.asPath), [router.asPath])

  // Render the translation on the server side
  useSSR(props.pageProps.i18n, locale)

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <LocaleProvider value={locale}>
      <I18nextProvider i18n={i18n}>
        <Layout>
          <DefaultSeo {...seoDefaultConfig} />
          <props.Component {...props.pageProps} />
        </Layout>
      </I18nextProvider>
    </LocaleProvider>
  )
  /* eslint-enable react/jsx-props-no-spreading */
}

export default App
