import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const titleTemplate = publicRuntimeConfig.titleTemplate.replace(
  '%siteName%',
  publicRuntimeConfig.site.siteName
)

const renderTitle = (pageTitle: string): string =>
  titleTemplate.replace('%pageTitle%', pageTitle)

export default renderTitle
