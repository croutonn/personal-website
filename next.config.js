const { locales, defaultLocale } = require('./i18n')

/**
 * @typedef {import('next-seo').DefaultSeoProps} DefaultSeoProps
 */

/**
 * @typedef  {Object} NextConfiguration
 * @property {Object}           serverRuntimeConfig      Runtime configuration in server side
 * @property {DefaultSeoProps}  serverRuntimeConfig.seo  `next-seo` default configuration
 */

/**
 * @type {NextConfiguration}
 */
const config = {
  i18n: {
    locales,
    defaultLocale,
  },

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
    localeMap: {
      ja: 'ja_JP',
      en: 'en_US',
    },
  },
}

module.exports = config
