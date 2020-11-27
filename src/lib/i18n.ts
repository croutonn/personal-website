import { promises } from 'fs'
import { resolve } from 'path'
import type { ParsedUrlQuery } from 'querystring'

import i18n from 'i18next'
import type { Resource, ResourceKey } from 'i18next'
import type { GetStaticPathsResult } from 'next'
import getConfig from 'next/config'
import type { NextRouter } from 'next/router'
import { createContext, useContext } from 'react'
import { initReactI18next } from 'react-i18next'

import { toSingleValue } from '@/lib/sanitize'
import type { IPageProps, ILocale } from '@/types'

const {
  publicRuntimeConfig: { i18n: i18nPublicConfig },
  serverRuntimeConfig: { i18n: i18nServerConfig },
} = getConfig()

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

const routeToLocale = (route: string | NextRouter): ILocale => {
  const queryLocale =
    typeof route !== 'string' && route.query?.locale
      ? (toSingleValue(route.query?.locale) as ILocale)
      : null
  if (queryLocale) {
    return queryLocale
  }
  const routeString = typeof route !== 'string' ? route.asPath : route
  const localePathToken = routeString.split('/').slice(1, 2)[0]
  const isLocale = i18nPublicConfig.locales.some(
    (locale) => locale === localePathToken
  )
  const locale = isLocale
    ? (localePathToken as ILocale)
    : i18nPublicConfig.defaultLocale
  return locale
}

const localePatterns = i18nPublicConfig.locales.reduce((prev, current) => {
  return {
    ...prev,
    [current]: new RegExp(`^\\/${current}(?![\\w_\\-.])`),
  }
}, {} as Record<ILocale, RegExp>)
const removeLocaleFromRoute = (route: string): string =>
  i18nPublicConfig.locales.reduce(
    (prev, current) => prev.replace(localePatterns[current], ''),
    route
  )

const localeContext = createContext(i18nPublicConfig.defaultLocale)
const LocaleProvider = localeContext.Provider
const useLocale = (): ILocale => useContext(localeContext)

const loadResources = async (options: {
  locale?: ILocale
  namespaces?: string[]
  noMinify?: boolean
}): Promise<Resource> => {
  const locale = options.locale || i18nPublicConfig.defaultLocale
  const namespaces = options.namespaces || i18nServerConfig.defaultNamespaces
  const noMinify = options.noMinify === true
  const { defaultLocale } = i18nPublicConfig
  const isDefaultLocale = locale === defaultLocale
  const locales = Array.from(new Set([locale, defaultLocale]))
  const resourceDirPath = resolve(process.cwd(), i18nServerConfig.resourceDir)

  const resourcePaths = locales
    .map((resourceLocale) => {
      const localeResourceDirPath = resolve(resourceDirPath, resourceLocale)
      return namespaces.map((namespace) => ({
        locale: resourceLocale,
        namespace,
        path: resolve(localeResourceDirPath, `${namespace}.json`),
      }))
    })
    .flat()

  const loadResource = (filePath: string) =>
    promises
      .readFile(filePath, { encoding: 'utf-8' })
      .then((data) => JSON.parse(data) as ResourceKey)

  const resources = await Promise.all(
    resourcePaths.map(
      async (resourcePath) =>
        ({
          [resourcePath.locale]: {
            [resourcePath.namespace]: await loadResource(
              resourcePath.path
            ).catch((error) => {
              if (resourcePath.locale === defaultLocale) {
                throw error
              } else {
                return {}
              }
            }),
          },
        } as Resource)
    )
  )
  const fallbackResource = resources
    .filter((resource) =>
      Object.prototype.hasOwnProperty.call(resource, defaultLocale)
    )
    .reduce((prev, currrent) => {
      return {
        [defaultLocale]: {
          ...prev[defaultLocale],
          ...currrent[defaultLocale],
        },
      }
    }, {} as Resource)

  if (isDefaultLocale) {
    return fallbackResource
  }

  const localeResource = resources
    .filter((resource) =>
      Object.prototype.hasOwnProperty.call(resource, locale)
    )
    .reduce((prev, currrent) => {
      return {
        [locale]: {
          ...prev[locale],
          ...currrent[locale],
        },
      }
    }, {} as Resource)

  if (!noMinify) {
    Object.keys(fallbackResource[defaultLocale]).forEach((namespace) => {
      const resourceKeys = localeResource[locale][namespace]
      const fallbackResourceKeys = fallbackResource[defaultLocale][namespace]
      if (
        typeof resourceKeys === 'string' ||
        typeof fallbackResourceKeys === 'string'
      ) {
        return
      }
      Object.keys(fallbackResourceKeys).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(resourceKeys, key)) {
          delete fallbackResourceKeys[key]
        }
      })
    })
  }

  return {
    ...localeResource,
    ...fallbackResource,
  }
}

const getI18nStaticProps = async ({
  locale,
  namespaces,
  noMinify,
}: Parameters<typeof loadResources>[0]): Promise<{ props: IPageProps }> => {
  const i18nResource = await loadResources({
    locale,
    namespaces,
    noMinify,
  })

  const props: IPageProps = {
    i18n: i18nResource,
  }

  return {
    props,
  }
}

const getI18nStaticPaths = <P extends ParsedUrlQuery>(
  staticPaths?: GetStaticPathsResult<P>
): GetStaticPathsResult<P & { locale: ILocale }> => {
  if (staticPaths) {
    return {
      paths: staticPaths.paths
        .map((staticPath) =>
          i18nPublicConfig.locales.map((locale) => ({
            params: (typeof staticPath === 'string'
              ? { locale }
              : { ...staticPath.params, locale }) as P & { locale: ILocale },
          }))
        )
        .flat(),
      fallback: staticPaths.fallback,
    }
  }

  return {
    paths: i18nPublicConfig.locales.map((locale) => ({
      params: { locale } as P & { locale: ILocale },
    })),
    fallback: false,
  }
}

export default i18n
export {
  getI18nStaticProps,
  getI18nStaticPaths,
  loadResources,
  LocaleProvider,
  removeLocaleFromRoute,
  routeToLocale,
  useLocale,
}
