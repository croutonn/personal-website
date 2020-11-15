type AlternateLinkData = { href: string; hrefLang: string; title: string }

type Locale = 'ja' | 'en'

type I18nPublicConfig = {
  locales: Locale[]
  defaultLocale: Locale
  localeMap: Record<Locale, string>
}

type I18nServerConfig = {
  defaultNamespaces: string[]
  resourceDir: string
}

export type { AlternateLinkData, Locale, I18nPublicConfig, I18nServerConfig }
