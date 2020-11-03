declare module 'next-translate/types' {
  import type { ParsedUrlQuery } from 'querystring'

  import type React from 'react'

  interface TranslationQuery {
    [name: string]: string | number
  }

  interface Translate {
    <R = string>(
      i18nKey: string,
      query: TranslationQuery,
      options?: { returnObjects: boolean }
    ): R
  }

  interface I18n {
    t: Translate
    lang: string
  }

  interface I18nDictionary {
    [key: string]: unknown
  }

  interface I18nLogger {
    (context: { namespace: string; i18nKey: string }): void
  }

  interface I18nConfig {
    defaultLocale?: string | (() => string)
    locales?: string[]
    currentPagesDir?: string
    finalPagesDir?: string
    localesPath?: string
    package?: boolean
    loadLocaleFrom?: ((language: string, namespace: string) => string) | null
    pages?: Record<
      string,
      | string[]
      | ((context: { req: Request; query: ParsedUrlQuery }) => string[])
    >
    logger?: I18nLogger
    logBuild?: boolean
  }

  interface TransProps {
    i18nKey: string
    components?: React.ReactNodeArray
    values?: Record<string, unknown>
  }

  interface DynamicNamespacesProps {
    dynamic: (language: string, namespace: string) => Promise<I18nDictionary>
    namespaces: string[]
    fallback?: React.ReactNode
  }

  interface I18nProviderProps {
    lang: string
    namespaces?: Record<string, I18nDictionary>
    logger?: I18nLogger
  }

  export {
    DynamicNamespacesProps,
    I18n,
    I18nConfig,
    I18nDictionary,
    I18nLogger,
    I18nProviderProps,
    Translate,
    TransProps,
    TranslationQuery,
  }
}
