import Head from 'next/head'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { appWithTranslation } from 'next-i18next'
import moment from 'moment'
import 'moment/locale/ru'
import { useRouter } from 'next/router'
import '@/styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  const { locale } = useRouter()
  moment.locale(locale)
  return (
    <SWRConfig value={{ revalidateIfStale: false }}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default appWithTranslation(MyApp)
