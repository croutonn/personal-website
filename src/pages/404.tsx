import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'react-i18next'

import { loadResources } from '@/lib/i18n'
import { PageParams, PageProps } from '@/types'

type Custom404Params = PageParams

type Custom404Props = PageProps

const Custom404: NextPage<Custom404Props> = () => {
  const { t } = useTranslation()
  return (
    <>
      <h1>{t('404:title')}</h1>
      <p>{t('404:tryInstead')}</p>
    </>
  )
}

const getStaticProps: GetStaticProps<
  Custom404Props,
  Custom404Params
> = async () => {
  const i18nResource = await loadResources({
    namespaces: ['common', '404'],
    noMinify: true,
  })

  const props: Custom404Props = { i18n: i18nResource }
  return {
    props,
  }
}

export default Custom404
export { getStaticProps }
export type { Custom404Params, Custom404Props }
