import Document, { Html, Head, Main, NextScript } from 'next/document'

class BonusCalcDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en" className="govuk-template lbh-template">
        <Head />
        <body
          className={`govuk-template__body env-${process.env.NEXT_PUBLIC_ENV_NAME}`}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default BonusCalcDocument
