import Head from 'next/head'
import { useRouter } from 'next/router'

type DefaultLayoutProps = unknown

const DefaultLayout: React.FunctionComponent<DefaultLayoutProps> = (props) => {
  const router = useRouter()
  return (
    <>
      <Head>
        <link
          rel="home"
          href={
            router.locale === router.defaultLocale ? '/' : `/${router.locale}`
          }
        />
        <link rel="license" href="#license" />
      </Head>
      {props.children}
    </>
  )
}

export default DefaultLayout
