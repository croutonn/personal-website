import tableCellStyle from '@mapbox/hast-util-table-cell-style'
import toH from 'hast-to-hyperscript'
import { createElement, Fragment } from 'react'
import type { Node } from 'unist'

import type { Maybe } from '@/types'

interface IHastNode extends Node {
  children?: IHastNode[]
}

const hastToReactNode = (node: IHastNode): React.ReactNode => {
  const has = {}.hasOwnProperty
  const components: Record<string, string | React.ComponentType> = {}
  const prefix = false

  // Wrap `createElement` to pass components in.
  const h = (
    name: string,
    props?: Maybe<React.Attributes>,
    children?: React.ReactNode[]
  ) => {
    let component: string | React.ComponentType = name
    if (has.call(components, name)) {
      component = components[name]
    }

    return createElement<{ children?: React.ReactElement }>(
      component,
      props,
      children
    )
  }

  let result: React.ReactElement | React.ReactNode[] = toH(
    h,
    tableCellStyle(node),
    prefix
  )

  if (node.type === 'root') {
    // Invert <https://github.com/syntax-tree/hast-to-hyperscript/blob/d227372/index.js#L46-L56>.
    if (
      result.type === 'div' &&
      result.props.children &&
      (node.children?.length !== 1 || node.children[0].type !== 'element')
    ) {
      result = result.props.children
    } else {
      result = [result]
    }

    return createElement(Fragment || 'div', {}, result)
  }

  return result
}

export default hastToReactNode
