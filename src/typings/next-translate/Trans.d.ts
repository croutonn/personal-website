declare module 'next-translate/Trans' {
  import type { TransProps } from 'next-translate/types'
  import type React from 'react'

  const Trans: React.ComponentType<TransProps>

  export default Trans
}
