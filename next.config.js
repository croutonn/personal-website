const { locales, defaultLocale } = require('./i18n')

module.exports = {
  i18n: {
    locales,
    defaultLocale,
  },

  publicRuntimeConfig: {
    site: {
      type: 'website',
      site: process.env.SITE_TWITTER_SITE_ID,
      image: '/static/images/site-cover.png',
      creator: process.env.SITE_CREATOR,
      siteName: process.env.SITE_TITLE,
      url: process.env.SITE_URL,
      description: process.env.SITE_DESCRIPTION,
      browserConfig: '/static/favicon/browserconfig.xml',
      tileColor: '#000000',
      themeColor: '#000',
    },
    titleTemplate: `%pageTitle% | %siteName%`,
  },
}
