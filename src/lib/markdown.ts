import rehypePrism from '@mapbox/rehype-prism'
import frontMatter from 'front-matter'
import LRU from 'lru-cache'
import { createElement, Fragment, ReactNode } from 'react'
import rehypeReact from 'rehype-react'
import katex from 'remark-html-katex'
import math from 'remark-math'
import markdown from 'remark-parse'
import remarkRehype from 'remark-rehype'
import unified from 'unified'

import { IS_SERVER } from '@/lib/constants'
import { Maybe } from '@/types'

const processor = unified()
  .use(markdown)
  .use(math)
  .use(katex)
  .use(remarkRehype)
  .use(rehypePrism)
  .use(rehypeReact, { createElement, Fragment })

const cache = new LRU<string, ReactNode>({
  max: parseInt(
    (IS_SERVER
      ? process.env.SERVER_MD_COMPILE_CACHE_MAX_SIZE
      : process.env.NEXT_PUBLIC_MD_COMPILE_CACHE_MAX_SIZE) || '',
    10
  ),
  maxAge: parseInt(
    (IS_SERVER
      ? process.env.SERVER_MD_COMPILE_CACHE_MAX_AGE
      : process.env.NEXT_PUBLIC_MD_COMPILE_CACHE_MAX_AGE) || '',
    10
  ),
  length: (_n, key) => (key || '').length,
})

const markdownToReactNode = (markdownText: string): ReactNode => {
  const cachedValue = cache.get(markdownText)
  if (cachedValue) {
    return cachedValue
  }
  const value = processor.processSync(markdownText).result as ReactNode
  cache.set(markdownText, value)
  return value
}

const readMarkdown = <T = unknown>(
  text: Maybe<string>
): Maybe<{ attributes: T; body: string }> => {
  if (!text) {
    return null
  }
  const { attributes, body } = frontMatter<T>(text)
  return {
    attributes,
    body,
  }
}

export { markdownToReactNode, readMarkdown }
