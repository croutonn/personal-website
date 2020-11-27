declare module 'next/config' {
  import type { IPublicRuntimeConfig, IServerRuntimeConfig } from '@/types/next'

  function getConfig<P = IPublicRuntimeConfig, S = IServerRuntimeConfig>(): {
    publicRuntimeConfig: P
    serverRuntimeConfig: S
  }
  export default getConfig
}
