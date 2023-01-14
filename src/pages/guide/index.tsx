import { SWRConfig } from 'swr'
import { GetStaticPropsContext } from 'next'
import { NextSeo } from 'next-seo'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { container, heading } from '@/themes/default'
import Layout from '@/templates/layouts/Default'
import Stages from '@/templates/guide/Stages'
import useUrl from '@/utils/hooks/useUrl'
import queries from '@/api'
import { fetcher } from '@/api/sanity'
import { GlobalProvider } from '@/contexts/global'

interface PageProps {
  fallback: { [key: string]: any }
}

const GuidePage = ({ fallback }: PageProps) => {
  const { t } = useTranslation()
  const { absoluteUrl } = useUrl()
  if(!fallback) return null;
  return (
    <SWRConfig value={{ fallback }}>
      <GlobalProvider value={{ type: 'guide' }}>
        <Layout>
          <NextSeo
            title={t('seo.pages.guide.title')}
            openGraph={{
              url: absoluteUrl('/guide'),
            }}
          />
          <div className={container.content}>
            <h1 className={heading.h1}>{t('menu.guide')}</h1>
            <Stages />
          </div>
        </Layout>
      </GlobalProvider>
    </SWRConfig>
  )
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const fallback: PageProps['fallback'] = {}

  const categoriesQuery = queries.common.getCategories('guide', locale)!
  fallback[categoriesQuery] = await fetcher(categoriesQuery)

  const themesQuery = queries.guide.getThemes(locale!)
  fallback[themesQuery] = await fetcher(themesQuery)

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
      fallback,
    },
    revalidate: 60
  }
}

export default GuidePage
