import { NextPage } from 'next'
import { DefaultSeoProps } from 'next-seo'
import { FunctionComponent } from 'react'

import { Authors } from '@/lib/constants'

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

type LocaleMapConfig = Record<string, string>

type PublicRuntimeConfig = {
  site: SiteConfig
  titleTemplate: string
  seo: DefaultSeoProps
  localeMap: LocaleMapConfig
}

type Page<P = unknown, LP = P, IP = P> = NextPage<P, IP> & {
  layout?: FunctionComponent<LP>
}

export type { BaseProps, Page, PublicRuntimeConfig, SiteConfig }
