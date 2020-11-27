import { render } from '@testing-library/react'
import { RouterContext } from 'next/dist/next-server/lib/router-context'
import type { NextRouter } from 'next/router'
import React from 'react'

const isReactElement = (x: any): x is React.ReactElement =>
  x && typeof x === 'object' && 'type' in x && 'props' in x && 'key' in x

const Providers: React.FunctionComponent = ({ children }) => {
  return isReactElement(children) ? children : null
  // return (
  //   <ThemeProvider theme="light">
  //     <TranslationProvider messages={defaultStrings}>
  //       {children}
  //     </TranslationProvider>
  //   </ThemeProvider>
  // )
}

const customRender = (
  ui: Parameters<typeof render>[0],
  options: Parameters<typeof render>[1] = {}
) => render(ui, { wrapper: Providers, ...options })

const withMockedRouter = (
  router: Partial<NextRouter> = {},
  children: React.ReactElement
): React.ReactElement => {
  const mockedRouter: NextRouter = {
    route: '',
    pathname: '',
    query: {},
    asPath: '',
    basePath: '',
    push: async () => true,
    replace: async () => true,
    reload: () => null,
    back: () => null,
    prefetch: async () => undefined,
    beforePopState: () => null,
    events: {
      on: () => null,
      off: () => null,
      emit: () => null,
    },
    isFallback: false,
    ...router,
  }

  return (
    <RouterContext.Provider value={mockedRouter}>
      {children}
    </RouterContext.Provider>
  )
}

export * from '@testing-library/react'
export { customRender as render, withMockedRouter }
