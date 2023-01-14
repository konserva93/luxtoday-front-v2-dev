import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { SWRConfig } from 'swr'
import { NextSeo } from 'next-seo'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/templates/layouts/Default'
import { container, heading } from '@/themes/default'
import queries from '@/api'
import { fetcher } from '@/api/sanity'
import { useRouter } from 'next/router'
import useUrl from '@/utils/hooks/useUrl'
import BodyContent from '@/templates/common/BodyContent'
import { GlobalProvider } from '@/contexts/global'
import { rewrites } from '@/../next.config'

interface PageProps {
  fallback: { [key: string]: any }
  translations: { [key: string]: any }
  content: any
}

const Content = ({ fallback, translations, content }: PageProps) => {
  const { absoluteUrl } = useUrl()
  const router = useRouter()

  return (
    <SWRConfig value={{ fallback }}>
      <NextSeo
        title={content.title}
        openGraph={{
          url: absoluteUrl(router.asPath),
        }}
      />
      <GlobalProvider value={{ translations }}>
        <Layout>
          <div className={container.content}>
            <h1 className={heading.h1}>{content.title}</h1>
            <BodyContent content={content.bodyContent} />
          </div>
        </Layout>
      </GlobalProvider>
    </SWRConfig>
  )
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return { paths: [], fallback: 'blocking' }
  }

  const content = await fetcher<{ locale: string; slug: string }[]>(
    queries.common.getContentPaths()
  )

  return {
    paths: content
      .filter(({ locale }) => locales?.includes(locale))
      .map(({ slug, locale }) => ({ params: { slug }, locale })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params, locale, locales }: GetStaticPropsContext) {
  const fallback: PageProps['fallback'] = {}
  const { slug } = params as { slug: string }

  const categoriesQuery = queries.common.getCategories('guide', locale)
  fallback[categoriesQuery] = await fetcher(categoriesQuery)

  const content = await fetcher<any>(queries.common.getContent(slug, locale))

  const pages = (await rewrites!()) as { destination: string; source: string }[]

  const hasRewrite = pages.find(({ destination }) => destination === `/${locale}/content/${slug}`)

  const translations = hasRewrite
    ? { rewrite: hasRewrite.source.slice(3) }
    : locales!.reduce<{ [key: string]: any }>((acc, curr) => {
        if (curr === locale) return acc
        const contentTranslation = content[`${curr}_slug`]
        if (contentTranslation) {
          acc[curr] = { slug: contentTranslation }
        }
        return acc
      }, {})

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
      fallback,
      content,
      translations,
    },
    revalidate: 60,
  }
}

export default Content
