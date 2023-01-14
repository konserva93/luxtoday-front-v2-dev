import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useTranslation } from 'next-i18next'
import QueryBuilder from '@/utils/QueryBuilder'
import { i18n } from '@/../next-i18next.config'
import { fetcher } from './sanity'
import { Image, PostType } from './posts'
import { useGlobalParams } from '@/contexts/global'

export interface Category {
  name: string
  slug: string
  is_visible_on_site: boolean
  description?: string
  icon?: string
  locale?: string
}

interface Link {
  name: string
  href: string
  icon?: string
}

export type CategoryType = 'news' | 'interview' | 'guide'

export interface SearchItem {
  _type: 'interview' | 'news' | 'guideArticles'
  image: Image
  title: string
  publishedAt: string
  slug: string
  category?: string
  stage?: string
  stageTitle?: string
  stageImage: Image
  theme?: string
}

export interface TagType {
  name: string
}

const queries = {
  getCategories: (type: CategoryType, locale?: string) => {
    const query = new QueryBuilder()
      .addField('mainImage.asset->url', 'icon')
      .addField('slug.current', 'slug')
      .addField('is_visible_on_site')
      .orderBy('order')

    if (locale) {
      query.where('lang.language._ref', locale)
      i18n.locales
        .filter((n) => n !== locale)
        .forEach((otherLocale) => {
          query.addField(`otherlang.${otherLocale}_language->slug.current`, `${otherLocale}_slug`)
        })
    } else {
      query.addField('lang.language._ref', 'locale')
    }

    if (type === 'news') {
      query.where('_type', 'headings')
    }

    if (type === 'interview') {
      query.where('_type', 'interviewHeadings')
    }

    if (type === 'guide') {
      query.where('_type', 'guideStages').addField('title', 'name').addField('description')
    }

    if (type === 'news' || type === 'interview') {
      query.addField('name').orderBy('order')
    }

    return query.build()
  },
  search: (
    text: string,
    type: 'news' | 'guideArticles' | 'interview',
    from: number,
    to: number,
    locale?: string
  ) => {
    const query = new QueryBuilder()
      .where('_type', type)
      .whereOr(
        new QueryBuilder()
          .where('title', text, 'match')
          .whereAnd(
            new QueryBuilder().defined('bodyContent').where('pt::text(bodyContent)', text, 'match')
          )
      )
      .whereRaw('!(_id in path("drafts.**"))')
      .addFields(['title', '_type', 'publishedAt'])
      .addField('slug.current', 'slug')
      .addField('mainCategory->slug.current', 'category')
      .addField('stages[0]->slug.current', 'stage')
      .addField('stages[0]->title', 'stageTitle')
      .addField(`stages[0]->${QueryBuilder.getImageField('mainImage')}`, 'stageImage')
      .addField('themes[0]->slug.current', 'theme')
      .addField(QueryBuilder.getImageField('mainImage'), 'image')
      .orderBy('publishedAt')
      .range(from, to)

    if (locale) {
      query.whereOr(
        new QueryBuilder().where('lang.language._ref', locale).where('lang._ref', locale)
      )
    }

    return query.build()
  },

  getTag: (slug: string, locale: string, type: 'tags' | 'interviewTags'): string => {
    const query = new QueryBuilder()
      .where('_type', type)
      .where('lang.language._ref', locale)
      .where('slug.current', slug)
      .addField('name')
    i18n.locales
      .filter((n) => n !== locale)
      .forEach((otherLocale) => {
        query.addField(`otherlang.${otherLocale}_language->slug.current`, `${otherLocale}_slug`)
      })
    return query.fetchOne().build()
  },

  getContent: (slug: string, locale?: string) => {
    const query = new QueryBuilder()
      .addField('title')
      .addField('bodyContent[]')
      .where('_type', 'documents')
      .where('slug.current', slug)

    i18n.locales
      .filter((n) => n !== locale)
      .forEach((otherLocale) => {
        query.addField(`otherlang.${otherLocale}_language->slug.current`, `${otherLocale}_slug`)
      })
    return query.fetchOne().build()
  },

  getContentPaths: () =>
    new QueryBuilder()
      .where('_type', 'documents')
      .addField('slug.current', 'slug')
      .addField('lang._ref', 'locale')
      .build(),

  getSitemap: () => {
    return new QueryBuilder()
      .whereIn('_type', [
        'news',
        'interview',
        'guideArticles',
        'guideThemes',
        'guideStages',
        'guideStages',
        'headings',
        'interviewHeadings',
      ])
      .addField('_type', 'type')
      .addField('slug.current', 'slug')
      .addField('mainCategory->slug.current', 'category')
      .addField('themes[0]->slug.current', 'theme')
      .addField('stages[0]->slug.current', 'stage')
      .addField('lang.language._ref', 'locale1')
      .addField('lang._ref', 'locale2')
      .addField('guideStages[0]->slug.current', 'guideStage')
      .build()
  },

  getEditorsChoise: (locale: string) => {
    const query = new QueryBuilder()
      .where('isEditorsChoise', true)
      .whereOr(new QueryBuilder().where('lang._ref', locale).where('lang.language._ref', locale))
      .addField('_type')
      .addField('title')
      .addField('slug.current', 'slug')
      .addField('editorOrder')
      .addField('mainCategory->slug.current', 'category')
      .addField('themes[0]->slug.current', 'theme')
      .addField('stages[0]->slug.current', 'stage')
      .orderBy('editorOrder')
      .range(0, 5, true)

    return query.build()
  },
}

export const useCategories = (type?: CategoryType) => {
  const { locale } = useRouter()
  const { data } = useSWR<Category[]>(
    type !== undefined ? queries.getCategories(type, locale) : null,
    fetcher
  )
  return data
}

export const useMenu = (): Link[] => {
  const { t } = useTranslation()
  const { type } = useGlobalParams()
  const categories = useCategories(type)
  if (!categories) return []

  const menu = categories.filter(({ is_visible_on_site }) => type === 'guide' || is_visible_on_site).map(
    (category: Category): Link => ({
      ...category,
      href: (type === 'news' ? '/' : `/${type}/`) + category.slug,
    })
  )
  if (type === 'news') {
    menu.unshift({ href: '/', name: t('today') })
  }
  return menu
}

export default queries
