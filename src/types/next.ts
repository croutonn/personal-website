import { ParsedUrlQuery } from 'querystring'

import { Resource } from 'i18next'
import { NextPage } from 'next'
import { DefaultSeoProps } from 'next-seo'
import { FunctionComponent } from 'react'

import { Authors } from '@/lib/constants'
import { I18nPublicConfig, I18nServerConfig, Locale } from '@/types/i18n'

type BaseProps = Record<string, unknown>

type SiteConfig = {
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

type PublicRuntimeConfig = {
  site: SiteConfig
  titleTemplate: string
  seo: DefaultSeoProps
  i18n: I18nPublicConfig
}

type ServerRuntimeConfig = {
  i18n: I18nServerConfig
}

type Page<P = unknown, LP = P, IP = P> = NextPage<P, IP> & {
  layout?: FunctionComponent<LP>
}

type PageProps<
  P extends Record<string, unknown> = Record<string, unknown>
> = P & { i18n: Resource }

type PageParams<P extends ParsedUrlQuery = ParsedUrlQuery> = P & {
  locale: Locale
}

export type {
  BaseProps,
  Page,
  PageProps,
  PageParams,
  PublicRuntimeConfig,
  ServerRuntimeConfig,
  SiteConfig,
}
