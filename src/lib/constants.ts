/* eslint-disable import/prefer-default-export */
export const QUERIES: Record<string, (...args: any) => string> = {
  GitHubGetUser: (user: string) => `GitHub/GetUser/${user}`,
}
