import { storiesOf } from '@storybook/react'
import React from 'react'

import Button from '@/components/atoms/Button'

storiesOf('Button', module).add('with text', () => {
  return <Button text="Hello World" />
})

storiesOf('Button', module).add('with emoji', () => {
  return <Button text="😀 😎 👍 💯" />
})
