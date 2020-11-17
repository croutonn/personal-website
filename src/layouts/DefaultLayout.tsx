import getConfig from 'next/config'
import Head from 'next/head'

import { useLocale } from '@/lib/i18n'
import { PublicRuntimeConfig } from '@/types'

type DefaultLayoutProps = unknown

const DefaultLayout: React.FunctionComponent<DefaultLayoutProps> = (props) => {
  const {
    publicRuntimeConfig: {
      i18n: { defaultLocale },
    },
  } = getConfig<PublicRuntimeConfig>()
  const locale = useLocale()
  return (
    <>
      <Head>
        <link rel="home" href={locale === defaultLocale ? '/' : `/${locale}`} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="license" href="#license" />
      </Head>
      {props.children}
    </>
  )
}

export default DefaultLayout
