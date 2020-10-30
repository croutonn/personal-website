import { AppType } from 'next/dist/next-server/lib/utils'

const App: AppType = (props) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <props.Component {...props.pageProps} />
}

export default App
