import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { NextSeo } from 'next-seo'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
import { container, heading } from '@/themes/default'
import Layout from '@/templates/layouts/Default'
import Content from '@/templates/guide/Content'
import Menu from '@/templates/guide/common/Menu'
import ThemesGrid from '@/templates/guide/common/ThemesGrid'
import Article from '@/templates/guide/Article'
import useUrl from '@/utils/hooks/useUrl'
import { GlobalProvider } from '@/contexts/global'
import queries from '@/api'
import { fetcher } from '@/api/sanity'
import { Article as ArticlyType, GuideTheme } from '@/api/guide'

interface PageProps {
  fallback: { [key: string]: any }
  translations: { [key: string]: any }
  article: ArticlyType
  theme: GuideTheme
}

const GuideArticlePage = ({ fallback, article, theme, translations }: PageProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { query } = router
  const { absoluteUrl } = useUrl()
  const {
    stage,
    theme: themeSlug,
    article: articleSlug,
  } = query as { stage: string; theme: string; article: string }

  if (!fallback) return null

  const otherThemes = theme.themes!.filter(({ slug }) => slug !== themeSlug)
  const otherArticles = theme.articles!.filter(({ slug }) => slug !== articleSlug)

  const url = absoluteUrl(`/guide/${stage}/${themeSlug}/${articleSlug}`)

  return (
    <SWRConfig value={{ fallback }}>
      <NextSeo
        title={article.title}
        description={t('seo.pages.guide.description')}
        canonical={url}
        openGraph={{ url }}
      />
      <GlobalProvider value={{ translations, type: 'guide' }}>
        <Layout>
          <div className={container.content}>
            <Content guideTheme={theme}>
              <Article {...article} theme={theme} />
            </Content>
            <Content>
              <div className={heading.h2}>{t('moreArticles')}</div>
              <Menu
                links={otherArticles.map(({ slug, title }) => ({
                  href: `/guide/${stage}/${themeSlug}/${slug}`,
                  title,
                }))}
              />
            </Content>
            <h2 className={heading.h2}>{t('otherSubjects')}</h2>
            <ThemesGrid stageSlug={stage} list={otherThemes} />
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

  const articles = await fetcher<
    { theme: string; stage: string; locale: string; article: string }[]
  >(queries.guide.getArticlesPath())

  return {
    paths: articles
      .filter(({ locale, theme, stage }) => theme && stage && locales?.includes(locale))
      .map(({ stage, theme, article, locale }) => ({
        params: { stage, theme, article },
        locale,
      })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params, locale, locales }: GetStaticPropsContext) {
  const fallback: PageProps['fallback'] = {}
  const {
    stage: stageSlug,
    theme: themeSlug,
    article: articleSlug,
  } = params as { stage: string; theme: string; article: string }

  const categoriesQuery = queries.common.getCategories('guide', locale)
  fallback[categoriesQuery] = await fetcher(categoriesQuery)

  const article = await fetcher<any>(queries.guide.getArticle(articleSlug, locale))
  const theme = await fetcher<any>(queries.guide.getTheme(locale!, stageSlug, themeSlug))

  const translations = locales!.reduce<PageProps['translations']>((acc, curr) => {
    if (curr === locale) return acc
    const articleTranslation = article[`${curr}_slug`]
    const themeTranslation = theme[`${curr}_slug`]
    const stageTranslation = theme[`${curr}_stages`]?.find(({ slug }: any) => slug === stageSlug)
    if (articleTranslation && stageTranslation && themeTranslation) {
      acc[curr] = {
        stage: stageTranslation.translation,
        theme: themeTranslation,
        article: articleTranslation,
      }
    }
    return acc
  }, {})

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
      fallback,
      article,
      theme,
      translations,
    },
    revalidate: 60,
  }
}

export default GuideArticlePage
