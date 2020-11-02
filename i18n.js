/**
 * @type {import('next-translate').I18nConfig}
 */
const config = {
  locales: ['en', 'ja'],
  localesPath: 'src/locales',
  currentPagesDir: 'src/pages_',
  finalPagesDir: 'src/pages',
  defaultLocale: 'ja',
  pages: {
    '*': ['common'],
    '/404': ['error'],
    '/': ['home'],
    'rgx:^/blog/': ['blog'],
  },
}

module.exports = config
