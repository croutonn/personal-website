import { defaultTheme, Provider as ThemeProvider } from '@adobe/react-spectrum'
import { SSRProvider } from '@react-aria/ssr'
import { DefaultSeo } from 'next-seo'
import getConfig from 'next/config'
import { AppType } from 'next/dist/next-server/lib/utils'

import { DefaultLayout } from '@/layouts'
import { Page, PublicRuntimeConfig } from '@/types'

const { publicRuntimeConfig } = getConfig() as {
  publicRuntimeConfig: PublicRuntimeConfig
}

const App: AppType = (props) => {
  const Layout = (props.Component as Page).layout || DefaultLayout

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <SSRProvider>
      <ThemeProvider theme={defaultTheme} minHeight="100%">
        <Layout>
          <DefaultSeo {...publicRuntimeConfig.seo} />
          <props.Component {...props.pageProps} />
        </Layout>
      </ThemeProvider>
    </SSRProvider>
  )
  /* eslint-enable react/jsx-props-no-spreading */
}

export default App
