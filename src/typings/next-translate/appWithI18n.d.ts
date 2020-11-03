declare module 'next-translate/appWithI18n' {
  import { I18n, I18nConfig } from 'next-translate/types'
  import React from 'react'

  const appWithI18n: <P = unknown>(
    app: React.ComponentType<P>,
    i18nConfig: I18nConfig
  ) => React.ComponentType<P & { i18n: I18n }>

  export default appWithI18n
}
