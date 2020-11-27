import Document, { Html, Head, Main, NextScript } from 'next/document'

type IDocumentProps = unknown

class AppDocument extends Document<IDocumentProps> {
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
