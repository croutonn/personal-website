import { GraphQLClient } from 'graphql-request'

import { getSdkWithHooks, SdkWithHooks } from '@/services/github/graphql'

const API_URL = 'https://api.github.com/graphql'

const getGithubAPIClient = (): SdkWithHooks => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_API_TOKEN}`,
  }
  return getSdkWithHooks(
    new GraphQLClient(API_URL, {
      headers,
    })
  )
}

export default getGithubAPIClient()
