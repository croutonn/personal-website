import Head from 'next/head'

import { AlternateLinkData } from '@/types'

type AlternateLinksProps = {
  alternates: AlternateLinkData[]
}

const AlternateLinks: React.FunctionComponent<AlternateLinksProps> = (
  props
) => {
  return (
    <Head>
      {props.alternates.map((locale) => (
        <link
          key={locale.hrefLang}
          rel="alternate"
          hrefLang={locale.hrefLang}
          href={locale.href}
          title={locale.title}
        />
      ))}
    </Head>
  )
}

export default AlternateLinks
