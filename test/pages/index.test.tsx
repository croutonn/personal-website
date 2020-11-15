/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-pascal-case */
import React from 'react'

import * as HomePage from '@/pages'

import { render, fireEvent } from '../test-utils'

describe('Home page', async () => {
  const { props: staticProps } = (await HomePage.getStaticProps({
    params: { locale: 'ja' },
  })) as { props: HomePage.HomePageProps; revalidate?: number | boolean }

  it('matches snapshot', () => {
    const { asFragment } = render(<HomePage.default {...staticProps} />, {})
    expect(asFragment()).toMatchSnapshot()
  })

  it('clicking button triggers alert', () => {
    const { getByText } = render(<HomePage.default {...staticProps} />, {})
    window.alert = jest.fn()
    fireEvent.click(getByText('Test Button'))
    expect(window.alert).toHaveBeenCalledWith('With typescript and Jest')
  })
})
