import { render } from '@testing-library/react'
import React from 'react'
// import { ThemeProvider } from "my-ui-lib"
// import { TranslationProvider } from "my-i18n-lib"
// import defaultStrings from "i18n/en-x-default"

const isReactElement = (x: unknown): x is React.ReactElement =>
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

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
