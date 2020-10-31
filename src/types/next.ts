import { NextPage } from 'next'
import { FunctionComponent } from 'react'

import { Authors } from '@/lib/constants'

type BaseProps = Record<string, unknown>

type SiteConfig = {
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
}

type Page<P = unknown, LP = P, IP = P> = NextPage<P, IP> & {
  layout?: FunctionComponent<LP>
}

export type { BaseProps, Page, PublicRuntimeConfig, SiteConfig }
