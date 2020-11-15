import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import getConfig from 'next/config'

import { useSEO } from '@/hooks'
import { GetUserQuery, githubClient } from '@/services/github'
import {
  Locale,
  Page,
  PageParams,
  PageProps,
  PublicRuntimeConfig,
} from '@/types'
import { getI18nStaticProps } from '@/lib/i18n'
import { Trans } from 'react-i18next'

type HomePageParams = PageParams

type HomePageProps = PageProps<{
  githubUser: GetUserQuery
}>

const { publicRuntimeConfig } = getConfig() as {
  publicRuntimeConfig: PublicRuntimeConfig
}

const getStaticProps: GetStaticProps<HomePageProps, HomePageParams> = async (
  context
) => {
  const { props: baseProps } = await getI18nStaticProps({
    locale: context.params?.locale as Locale,
    namespaces: ['common', 'home'],
  })
  const githubUserId = process.env.NEXT_PUBLIC_GITHUB_USER as string
  const githubUser = await githubClient.GetUser({ id: githubUserId })

  return {
    props: {
      ...baseProps,
      githubUser,
    },
  }
}

const HomePage: Page<HomePageProps> = (props) => {
  const githubUserId = process.env.NEXT_PUBLIC_GITHUB_USER as string
  const githubGetUser = githubClient.useGetUser(
    { id: githubUserId },
    { initialData: props.githubUser }
  )

  const seo = useSEO({
    title: publicRuntimeConfig.site.name,
    titleTemplate: '%s',
  })

  return (
    <div className="container">
      <NextSeo {...seo} />

      <main>
        <h1 className="title">
          <Trans i18nKey="home:WelcomeToNextJs">
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </Trans>
        </h1>

        <p className="description">
          <Trans i18nKey="common:GetStartedByEditing">
            Get started by editing <code>pages/index.tsx</code>
          </Trans>
        </p>

        <button
          type="button"
          onClick={() => {
            // eslint-disable-next-line no-alert
            window.alert('With typescript and Jest')
          }}
        >
          Test Button
        </button>

        <div className="grid">
          <a href="https://nextjs.org/docs" className="card">
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className="card">
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className="card"
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className="card"
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>

        <div>{githubGetUser.data?.user?.bio}</div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          margin: 0;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export default HomePage
export { getStaticProps }
export type { HomePageParams, HomePageProps }