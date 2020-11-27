import type { ParsedUrlQuery } from 'querystring'

import type { Resource } from 'i18next'
import type { NextPage } from 'next'
import type { DefaultSeoProps } from 'next-seo'
import type { FunctionComponent } from 'react'

import type { Authors } from '@/lib/constants'
import type { II18nPublicConfig, II18nServerConfig, ILocale } from '@/types'

interface IBaseProps {
  [key: string]: unknown
}

interface ISiteConfig {
  name: string
  type: 'website' | 'blog'
  siteName: string
  twitterCard?: 'summary' | 'summary_large_image'
  site?: string
  creator?: keyof typeof Authors
  description: string
  url: string
  image?: string
  themeColor?: string
  tileColor?: string
  browserConfig?: string
}

interface IPublicRuntimeConfig {
  site: ISiteConfig
  titleTemplate: string
  seo: DefaultSeoProps
  i18n: II18nPublicConfig
}

interface IServerRuntimeConfig {
  i18n: II18nServerConfig
  blog: {
    repository: {
      owner: string
      name: string
      branch: string
      directory: string
    }
  }
}

type IPage<P = unknown, LP = P, IP = P> = NextPage<P, IP> & {
  layout?: FunctionComponent<LP>
}

type IPageProps<
  P extends Record<string, unknown> = Record<string, unknown>
> = P & { i18n: Resource }

type IPageParams<P extends ParsedUrlQuery = ParsedUrlQuery> = P & {
  locale: ILocale
}

export type {
  IBaseProps,
  IPage,
  IPageProps,
  IPageParams,
  IPublicRuntimeConfig,
  IServerRuntimeConfig,
  ISiteConfig,
}
