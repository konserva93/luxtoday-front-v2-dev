import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { NextSeo } from 'next-seo'
import { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { container, heading } from '@/themes/default'
import Layout from '@/templates/layouts/Default'
import Article from '@/templates/guide/Content'
import ThemesGrid from '@/templates/guide/common/ThemesGrid'
import Menu from '@/templates/guide/common/Menu'
import useUrl from '@/utils/hooks/useUrl'
import useAlternates from '@/utils/hooks/useAlternates'
import { GlobalProvider } from '@/contexts/global'
import queries from '@/api'
import { fetcher } from '@/api/sanity'
import { GuideTheme } from '@/api/guide'

interface PageProps {
  fallback: { [key: string]: any }
  theme: GuideTheme
  translations: { [key: string]: any }
}

const Alternates = () => {
  const alternates = useAlternates()

  return <NextSeo languageAlternates={alternates} />
}

const GuidePage = ({ fallback, theme, translations }: PageProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { absoluteUrl } = useUrl()
  const { query } = router

  const { stage, theme: themeSlug } = query as { stage: string; theme: string }

  if (!fallback) return null

  const themes = theme.themes!.filter(({ slug }) => slug !== themeSlug)

  return (
    <SWRConfig value={{ fallback }}>
      <NextSeo
        title={theme.title}
        description={t('seo.pages.guide.description')}
        openGraph={{
          url: absoluteUrl(`/guide/${stage}/${themeSlug}`),
        }}
      />
      <GlobalProvider value={{ translations, type: 'guide' }}>
        <Alternates />
        <Layout>
          <div className={container.content}>
            <h1 className={heading.h1}>{t('menu.guide')}</h1>
            <Article guideTheme={theme}>
              <div className={heading.h1}>{t('articles')}</div>
              <Menu
                links={theme.articles!.map(({ title, slug }) => ({
                  href: `/guide/${stage}/${themeSlug}/${slug}`,
                  title,
                }))}
              />
            </Article>
            <h2 className={heading.h2}>{t('otherSubjects')}</h2>
            <ThemesGrid stageSlug={stage} list={themes} />
          </div>
        </Layout>
      </GlobalProvider>
    </SWRConfig>
  )
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return { paths: [], fallback: true }
  }

  const themes = await fetcher<{ stage: string; theme: string; locale: string }[]>(
    queries.guide.getThemesPaths()
  )

  return {
    paths: themes
      .filter(({ locale }) => locales?.includes(locale))
      .map(({ stage, theme, locale }) => ({
        params: { stage, theme },
        locale,
      })),
    fallback: true,
  }
}

export async function getStaticProps({ params, locale, locales }: GetStaticPropsContext) {
  const fallback: PageProps['fallback'] = {}
  const { stage: stageSlug, theme: themeSlug } = params as { stage: string; theme: string }

  const categoriesQuery = queries.common.getCategories('guide', locale)
  fallback[categoriesQuery] = await fetcher(categoriesQuery)

  const theme = await fetcher<any>(queries.guide.getTheme(locale!, stageSlug, themeSlug))

  const translations = locales!.reduce<PageProps['translations']>((acc, curr) => {
    if (curr === locale) return acc
    const themeTranslation = theme[`${curr}_slug`]
    const stageTranslation = theme[`${curr}_stages`]?.find(({ slug }: any) => slug === stageSlug)
    if (stageTranslation && themeTranslation) {
      acc[curr] = { theme: themeTranslation, stage: stageTranslation.translation }
    }
    return acc
  }, {})

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
      fallback,
      theme,
      translations,
    },
    revalidate: 60,
  }
}

export default GuidePage
