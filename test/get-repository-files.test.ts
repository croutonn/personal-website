/* eslint-disable no-underscore-dangle */
import { getBlogPosts } from '@/lib/blog'
import client from '@/services/github/client'

describe('Get Repository Files', () => {
  const TARGET_REPOSITORY = {
    owner: 'croutonn',
    name: 'personal-website-content',
  }

  it('basic', async () => {
    const result = await client.GetDirectoriesWithFiles({
      ...TARGET_REPOSITORY,
      expression: 'main:src/posts',
    })
    if (result.repository?.object?.__typename !== 'Tree') {
      throw new Error()
    }
    const directories = result.repository?.object?.entries || []
    if ((directories.length || 0) < 1 || !directories[0]) {
      throw new Error('​There are no posts')
    }
    const sampleDirectory = directories.find(
      (entry) => entry.object?.__typename === 'Tree'
    )
    if (
      !sampleDirectory?.object ||
      sampleDirectory.object.__typename !== 'Tree'
    ) {
      throw new Error('​There are no posts')
    }
    const sampleFile = (sampleDirectory.object.entries || []).find(
      (entry) => entry.object?.__typename === 'Blob'
    )
    if (!sampleFile || sampleFile?.object?.__typename !== 'Blob') {
      throw new Error('​There are no posts')
    }
    const file = {
      name: sampleFile.name,
      id: sampleFile.object.id,
      text: sampleFile.object.text,
    }
    expect(file.id.length > 0).toBe(true)
  })

  it('getBlogPosts', async () => {
    const result = await getBlogPosts()
    expect(result.length > 0).toBe(true)
  })
})
