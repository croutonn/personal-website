declare module 'app-root-path' {
  import { resolve } from 'path'

  interface AppRoot {
    resolve: typeof resolve
    require: NodeRequire
    toString: () => string
    path: string
  }
  const appRoot: AppRoot

  export default appRoot
}
