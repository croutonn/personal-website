import getConfig from 'next/config'

import { PublicRuntimeConfig } from '@/types'

const { publicRuntimeConfig } = getConfig() as {
  publicRuntimeConfig: PublicRuntimeConfig
}

const titleTemplate = publicRuntimeConfig.titleTemplate.replace(
  '%siteName%',
  publicRuntimeConfig.site.siteName
)

const renderTitle = (pageTitle: string): string =>
  titleTemplate.replace('%pageTitle%', pageTitle)

export default renderTitle
