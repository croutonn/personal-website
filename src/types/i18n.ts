interface IAlternateLinkData {
  href: string
  hrefLang: string
  title: string
}

type ILocale = 'ja' | 'en'

interface II18nPublicConfig {
  locales: ILocale[]
  defaultLocale: ILocale
  localeMap: Record<ILocale, string>
}

interface II18nServerConfig {
  defaultNamespaces: string[]
  resourceDir: string
}

export type {
  IAlternateLinkData,
  ILocale,
  II18nPublicConfig,
  II18nServerConfig,
}
