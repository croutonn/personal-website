import Document, { Html, Head, Main, NextScript } from 'next/document'

type DocumentProps = unknown

class AppDocument extends Document<DocumentProps> {
  render(): JSX.Element {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
