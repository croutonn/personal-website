declare module 'next-translate/withTranslation' {
  import { I18n } from 'next-translate/types'
  import React from 'react'

  const withTranslation: <P = unknown>(
    component: React.ComponentType<P>
  ) => React.ComponentType<P & { i18n: I18n }>

  export default withTranslation
}
