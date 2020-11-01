/**
 * @type {import('next-translate/types')}
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
