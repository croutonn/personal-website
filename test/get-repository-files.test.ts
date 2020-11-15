/* eslint-disable no-underscore-dangle */
import client from '@/services/github/client'

describe('Get Repository Files', () => {
  const TARGET_REPOSITORY = {
    owner: 'croutonn',
    name: 'personal-website-content',
  }

  it('basic', async () => {
    const result = await client.GetFiles({
      ...TARGET_REPOSITORY,
      expression: 'main:',
    })
    expect(result.repository?.object?.__typename).toBe('Tree')
  })
})
