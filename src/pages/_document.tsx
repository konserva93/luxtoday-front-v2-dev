import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document'
import Script from 'next/script'
import sprite from 'svg-sprite-loader/runtime/sprite.build'

interface DocumentProps extends DocumentInitialProps {
  spriteContent: string
}

class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentProps> {
    const initialProps = await Document.getInitialProps(ctx)
    const spriteContent = sprite.stringify()
    return {
      ...initialProps,
      spriteContent,
    }
  }
  render() {
    let gaConfig = `window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());`
    if (process.env.NEXT_PUBLIC_GTM_ID) {
      gaConfig += `gtag('config', '${process.env.NEXT_PUBLIC_GTM_ID}');`
    }
    if (process.env.NEXT_PUBLIC_GUA_ID) {
      gaConfig += `gtag('config', '${process.env.NEXT_PUBLIC_GUA_ID}');`
    }
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          {process.env.NEXT_PUBLIC_GTM_ID && (
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              strategy="afterInteractive"
            />
          )}
          <Script id="google-analytics" strategy="afterInteractive">
            {gaConfig}
          </Script>
        </Head>
        <body>
          <div dangerouslySetInnerHTML={{ __html: this.props.spriteContent }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
