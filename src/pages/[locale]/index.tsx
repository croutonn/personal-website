import type { GetStaticPaths } from 'next'

import { getI18nStaticPaths } from '@/lib/i18n'
import * as HomePage from '@/pages'

const { getStaticProps } = HomePage

const getStaticPaths: GetStaticPaths<HomePage.IParams> = async () =>
  getI18nStaticPaths()

export default HomePage.default

export { getStaticProps, getStaticPaths }
