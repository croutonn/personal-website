import { AppType } from 'next/dist/next-server/lib/utils'

const App: AppType = ({ Component, pageProps }) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />
}

export default App
