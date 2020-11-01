import { AppType } from 'next/dist/next-server/lib/utils'

import { DefaultLayout } from '@/layouts'
import { Page } from '@/types'

const App: AppType = (props) => {
  const Layout = (props.Component as Page).layout || DefaultLayout

  return (
    <Layout>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <props.Component {...props.pageProps} />
    </Layout>
  )
}

export default App
