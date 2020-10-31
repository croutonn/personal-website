import Head from 'next/head'

import normalizeDocumentMetaData from '@/lib/normalize-document-meta-data'
import { DocumentMetaData } from '@/types'

type DocumentMetaTagsProps = {
  locale: string
  data: DocumentMetaData
}

const DocumentMetaTags: React.FunctionComponent<DocumentMetaTagsProps> = (
  props
) => {
  const normalizedData = normalizeDocumentMetaData(props.data)

  return (
    <Head>
      <meta name="msapplication-TileColor" content={normalizedData.tileColor} />
      {normalizedData.browserConfig && (
        <meta
          name="msapplication-config"
          content={normalizedData.browserConfig}
        />
      )}
      <meta name="theme-color" content={normalizedData.themeColor} />
      <meta property="og:type" content={normalizedData.type} />
      <meta property="og:site_name" content={normalizedData.siteName} />
      <meta name="twitter:card" content={normalizedData.twitterCard} />
      {normalizedData.image && (
        <>
          <meta property="og:image" content={normalizedData.image} />
          <meta name="twitter:image" content={normalizedData.image} />
        </>
      )}
      {normalizedData.site && (
        <meta name="twitter:site" content={`@${normalizedData.site}`} />
      )}
      {normalizedData.creator && (
        <meta name="twitter:creator" content={`@${normalizedData.creator}`} />
      )}
      <meta property="og:title" content={normalizedData.title} />
      <meta name="twitter:title" content={normalizedData.title} />
      <meta property="og:url" content={normalizedData.url} />
      <meta name="twitter:url" content={normalizedData.url} />
      <meta property="og:description" content={normalizedData.description} />
      <meta name="description" content={normalizedData.description} />
      <meta name="twitter:description" content={normalizedData.description} />
    </Head>
  )
}

export default DocumentMetaTags
