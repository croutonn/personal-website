import { useMemo } from 'react'

import { markdownToReactNode } from '@/lib/markdown'
import type { IBlogPost } from '@/types'

interface IPostProps {
  post: IBlogPost
}

const Post: React.FunctionComponent<IPostProps> = (props) => {
  const postContent = useMemo(() => markdownToReactNode(props.post.content), [
    props.post.content,
  ])

  return (
    <article id={props.post.slug}>
      <header>
        <h1>{props.post.title}</h1>
      </header>
      <div>{postContent}</div>
    </article>
  )
}

export default Post
