import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'react-i18next'

import { loadResources } from '@/lib/i18n'
import type { IPageParams, IPageProps } from '@/types'

type ICustom404Params = IPageParams

type ICustom404Props = IPageProps

const Custom404: NextPage<ICustom404Props> = () => {
  const { t } = useTranslation()
  return (
    <>
      <h1>{t('404:title')}</h1>
      <p>{t('404:tryInstead')}</p>
    </>
  )
}

const getStaticProps: GetStaticProps<
  ICustom404Props,
  ICustom404Params
> = async () => {
  const i18nResource = await loadResources({
    namespaces: ['common', '404'],
    noMinify: true,
  })

  const props: ICustom404Props = { i18n: i18nResource }
  return {
    props,
  }
}

export default Custom404
export { getStaticProps }
export type { ICustom404Params, ICustom404Props }
