declare module 'next/config' {
  function getConfig<P = unknown, S = unknown>(): {
    publicRuntimeConfig: P
    serverRuntimeConfig: S
  }
  export default getConfig
}
