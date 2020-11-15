import { NextRouter } from 'next/router'
import React from 'react'

import * as HomePage from '@/pages'

import { render, fireEvent, withMockedRouter } from '../test-utils'

describe('Home page', () => {
  let router: Partial<NextRouter>
  let staticProps: HomePage.HomePageProps
  let pageComponent: React.ReactElement

  beforeAll(async () => {
    const props = (await HomePage.getStaticProps({
      params: { locale: 'ja' },
    })) as { props: HomePage.HomePageProps; revalidate?: number | boolean }
    staticProps = props.props
    router = {
      asPath: '/',
    }
    pageComponent = withMockedRouter(
      router,
      <HomePage.default {...staticProps} />
    )
  })

  it('matches snapshot', () => {
    const { asFragment } = render(pageComponent, {})
    expect(asFragment()).toMatchSnapshot()
  })

  it('clicking button triggers alert', () => {
    const { getByText } = render(pageComponent, {})
    window.alert = jest.fn()
    fireEvent.click(getByText('Test Button'))
    expect(window.alert).toHaveBeenCalledWith('With typescript and Jest')
  })
})
