const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withPlugins = require('next-compose-plugins')
const withLinaria = require('next-linaria')

const i18n = require('./i18n.config')

const plugins = [[withBundleAnalyzer], [withLinaria]]

/**
 * @param {import('webpack-chain')} config
 * @param {Object} param1
 */
const webpack = (config, { isServer }) => {
  if (!isServer) {
    // eslint-disable-next-line no-param-reassign
    config.node = {
      fs: 'empty',
    }
  }

  return config
}

/**
 * @typedef {import('./src/types/next').PublicRuntimeConfig} PublicRuntimeConfig
 * @typedef {import('./src/types/next').ServerRuntimeConfig} ServerRuntimeConfig
 */

/**
 * @typedef  {Object} NextConfiguration
 * @property {PublicRuntimeConfig} publicRuntimeConfig
 * @property {ServerRuntimeConfig} serverRuntimeConfig
 */

/**
 * @type {NextConfiguration}
 */
const config = {
  publicRuntimeConfig: {
    site: {
      name: process.env.SITE_TITLE,
      url: process.env.SITE_URL,
      description: process.env.SITE_DESCRIPTION,
    },
    seo: {
      title: process.env.SITE_TITLE,
      titleTemplate: `%s | ${process.env.SITE_TITLE}`,
      description: process.env.SITE_DESCRIPTION,
      openGraph: {
        type: 'website',
        site_name: process.env.SITE_TITLE,
        title: process.env.SITE_TITLE,
        description: process.env.SITE_DESCRIPTION,
        images: [`${process.env.SITE_URL}/static/images/site-cover.png`],
      },
      twitter: {
        cardType: 'summary_large_image',
        site: `@${process.env.SITE_TWITTER_SITE_ID}`,
        handle: `@${process.env.SITE_TWITTER_CREATOR_ID}`,
      },
      additionalMetaTags: [
        {
          name: 'msapplication-TileColor',
          content: '#000000',
        },
        {
          name: 'msapplication-config',
          content: '/static/favicon/browserconfig.xml',
        },
        {
          name: 'theme-color',
          content: '#000000',
        },
      ],
    },
    i18n: {
      locales: i18n.locales,
      defaultLocale: i18n.defaultLocale,
      localeMap: {
        ja: 'ja_JP',
        en: 'en_US',
      },
    },
  },
  serverRuntimeConfig: {
    i18n: {
      defaultNamespaces: i18n.defaultNamespaces,
      resourceDir: i18n.resourceDir,
    },
    blog: {
      repository: {
        owner: process.env.CONTENT_REPOSITORY_OWNER,
        name: process.env.CONTENT_REPOSITORY_NAME,
        branch: process.env.CONTENT_REPOSITORY_BLOG_BRANCH,
        directory: process.env.CONTENT_REPOSITORY_BLOG_DIRECTORY,
      },
    },
  },
  redirects: async () => {
    return [
      {
        source: `/${i18n.defaultLocale}`,
        destination: '/',
        permanent: true,
      },
      {
        source: `/${i18n.defaultLocale}/:path*`,
        destination: '/:path*',
        permanent: true,
      },
    ]
  },
  webpack,
}

module.exports = withPlugins(plugins, config)
