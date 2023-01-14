import { useRouter } from 'next/router'
import useSWR from 'swr'
import QueryBuilder from '@/utils/QueryBuilder'
import { i18n } from '@/../next-i18next.config'
import { Category, useCategories } from './common'
import { fetcher } from './sanity'

export interface GuideTheme {
  description?: string
  title: string
  slug: string
  icon: string
  isHold?: boolean
  themes?: GuideTheme[]
  articles?: { title: string; slug: string }[]
}

export interface GuideThemeGroup extends Category {
  themes: GuideTheme[]
}

export interface Article {
  title: string
  date: string
  bodyContent: any[]
  sources: string
  nextArticle: string
}

const queries = {
  getThemes: (locale: string, stageSlug?: string) => {
    const query = new QueryBuilder()
      .where('_type', 'guideThemes')
      .where('lang.language._ref', locale)
      .addFields(['title', 'isHold'])
      .addField('mainImage.asset->url', 'icon')
      .addField('guideStages[]->slug.current', 'parents')
      .addField('slug.current', 'slug')
      .orderBy('order')

    if (stageSlug) {
      query.where('guideStages[]->slug.current', stageSlug, 'in')
    }

    return query.build()
  },

  getThemesPaths: () => {
    return new QueryBuilder()
      .where('_type', 'guideThemes')
      .addField('guideStages[0]->slug.current', 'stage')
      .addField('slug.current', 'theme')
      .addField('lang.language._ref', 'locale')
      .build()
  },

  getTheme: (locale: string, stageSlug: string, themeSlug: string) => {
    const articles = new QueryBuilder()
      .where('_type', 'guideArticles')
      .where('stages[]->slug.current', stageSlug, 'in')
      .where('themes[]->slug.current', themeSlug, 'in')
      .where('lang.language._ref', locale)
      .addField('title')
      .addField('slug.current', 'slug')
      .orderBy('order')
      .build()

    const themes = queries.getThemes(locale, stageSlug)

    const query = new QueryBuilder()
      .where('_type', 'guideThemes')
      .where('lang.language._ref', locale)
      .where('slug.current', themeSlug)
      .addField('title')
      .addField('mainImage.asset->url', 'icon')
      .addField(themes, 'themes')
      .addField(articles, 'articles')

    i18n.locales
      .filter((n) => n !== locale)
      .forEach((otherLocale) => {
        query.addField(`otherlang.${otherLocale}_language->slug.current`, `${otherLocale}_slug`)
        query.addField(
          `guideStages[]->{"slug": slug.current, "translation": otherlang.${otherLocale}_language->slug.current}`,
          `${otherLocale}_stages`
        )
      })

    return query.fetchOne().build()
  },

  getArticle: (slug: string, locale?: string) => {
    const query = new QueryBuilder()
      .where('_type', 'guideArticles')
      .where('slug.current', slug)
      .addFields(['title', 'sources', 'bodyContent[]'])
      .addField(`nextArticleId->slug.current`, 'nextArticle')
      .addField('_updatedAt', 'date')

    i18n.locales
      .filter((n) => n !== locale)
      .forEach((otherLocale) => {
        query.addField(`otherlang.${otherLocale}_language->slug.current`, `${otherLocale}_slug`)
      })

    return query.fetchOne().build()
  },

  getArticlesPath: () => {
    return new QueryBuilder()
      .where('_type', 'guideArticles')
      .addField('lang.language._ref', 'locale')
      .addField('themes[0]->slug.current', 'theme')
      .addField('stages[0]->slug.current', 'stage')
      .addField('slug.current', 'article')
      .build()
  },
}

export const useStages = () => {
  const { locale } = useRouter()
  const categories = useCategories('guide')
  const { data } = useSWR<(GuideTheme & { parents: string[] })[]>(
    queries.getThemes(locale!),
    fetcher
  )
  if (!data) return []

  const group: GuideThemeGroup[] = categories!.map((category) => ({
    ...category,
    themes: data
      .filter(({ parents }) => parents.includes(category.slug))
      .map(({ parents, ...theme }): GuideTheme => theme),
  }))
  return group
}

export default queries
