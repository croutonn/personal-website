const IS_SERVER = typeof window === 'object'

const QUERIES: Record<string, (...args: any) => string> = {
  GitHubGetUser: (user: string) => `GitHub/GetUser/${user}`,
}

const Authors = {
  croutonn: {
    twitter: 'croutnn',
    github: 'croutonn',
  },
}

export { IS_SERVER, QUERIES, Authors }
