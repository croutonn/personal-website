import getConfig from 'next/config'

import { DocumentMetaData, PublicRuntimeConfig } from '@/types'

type OptionalProps = 'image' | 'site' | 'creator' | 'browserConfig'
type NormalizedDocumentMetaData = Partial<
  Pick<DocumentMetaData, OptionalProps>
> &
  Required<Omit<DocumentMetaData, OptionalProps>>

const { publicRuntimeConfig } = getConfig() as {
  publicRuntimeConfig: PublicRuntimeConfig
}

const normalizeDocumentMetaData = (
  data: DocumentMetaData
): NormalizedDocumentMetaData => {
  const siteData = publicRuntimeConfig.site
  const normalizedData: NormalizedDocumentMetaData = {
    type: data.type || 'website',
    image: data.image || siteData.image,
    twitterCard: data.twitterCard || 'summary_large_image',
    siteName: data.siteName || siteData.siteName,
    site: data.site || siteData.site,
    creator: data.creator || siteData.creator,
    title: data.title || data.siteName || siteData.siteName,
    url: data.url || siteData.url,
    // TODO: translate siteData.description
    description: data.description || siteData.description,
    tileColor: data.tileColor || siteData.tileColor || '#000000',
    themeColor: data.themeColor || siteData.themeColor || '#000',
    browserConfig: data.browserConfig || siteData.browserConfig,
  }

  return normalizedData
}

export default normalizeDocumentMetaData
