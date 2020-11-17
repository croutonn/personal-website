import { useMemo } from 'react'

import { markdownToReactNode } from '@/lib/markdown'
import { BlogPost } from '@/types'

type PostProps = {
  post: BlogPost
}

const Post: React.FunctionComponent<PostProps> = (props) => {
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
