import { Authors } from '@/lib/constants'
import { SiteConfig } from '@/types/next'

type DocumentMetaData = Omit<
  Partial<SiteConfig>,
  'title' | 'url' | 'creator'
> & {
  title: string
  url: string
  creator: typeof Authors[keyof typeof Authors]['twitter']
}

export type { DocumentMetaData }
