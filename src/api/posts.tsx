import { useRouter } from 'next/router'
import useSWRInfinite from 'swr/infinite'
import QueryBuilder from '@/utils/QueryBuilder'
import { i18n } from '@/../next-i18next.config'
import { Category } from './common'
import { fetcher } from './sanity'

export const PAGE_SIZE = 10

export type PostType = 'news' | 'interview'

export const getPostQuery = (locale: string) => {
  return new QueryBuilder()
    .addFields([
      '_id',
      '_type',
      'title',
      'publishedAt',
      'mainImage',
      'updatedAt',
      'isPartner',
    ])
    .addField('seo')
    .addField('pt::text(bodyContent[0])', 'excerpt')
    .addField('bodyContent[]')
    .addField('slug.current', 'slug')
    .addField(`sources{title, url,${QueryBuilder.getImageField('mainImage', 'logo')}}`)
    .addField(
      `mainCategory->{name, "slug": slug.current, "icon": mainImage.asset->url}`,
      'category'
    )
    .addField(QueryBuilder.getImageField('mainImage'), 'image')
    .addField('mainImage.caption', 'imageCaption')
    .addField('author').addField(`author->{
      ${QueryBuilder.getLocalizedField('title', locale)},
      ${QueryBuilder.getImageField('mainImage', 'avatar')}
    }`)
}

const queries = {
  getMany: (
    locale: string,
    type: PostType,
    from: number = 0,
    to: number = PAGE_SIZE - 1,
    category?: string
  ): string => {
    const query = getPostQuery(locale)
    if (category) {
      query.where('mainCategory->slug.current', category)
    }
    if(type === 'interview') {
      query.addField('hero{name, photo, career}')
    }

    return query
      .where('_type', type)
      .where('lang._ref', locale)
      .orderBy('publishedAt')
      .range(from, to)
      .build()
  },

  getBySlug: (locale: string, type: PostType, slug: string): string => {
    const query = getPostQuery(locale)
      .fetchOne()
      .addField('hero')
      .addField('isContentEnabled')
      .addField('editor')
      .where('_type', type)
      .where('slug.current', slug)

    i18n.locales
      .filter((n) => n !== locale)
      .forEach((otherLocale) => {
        query.addField(`otherlang.${otherLocale}_language->slug.current`, `${otherLocale}_slug`)
        query.addField(
          `mainCategory->otherlang.${otherLocale}_language->slug.current`,
          `${otherLocale}_category`
        )
      })

    return query.build()
  },

  getByTag: (locale: string, type: PostType, slug: string, from: number, to: number): string => {
    const query = getPostQuery(locale)
      .where('_type', type)
      .where('tags[]->slug.current', slug, 'in')
      .orderBy('publishedAt')
      .range(from, to)

    return query.build()
  },

  getSimilar: (
    locale: string,
    type: string,
    category: string,
    slug: string,
    from: number,
    to: number
  ): string => {
    const query = getPostQuery(locale)
      .where('_type', type)
      .where('slug.current', slug, '!=')
      .where('lang._ref', locale)
      .range(from, to)

    if(type === 'news') {
      query.where('mainCategory->slug.current', category)
    }

    if(type === 'interview') {
      query.addField('hero{name, photo, career}')
      query.orderBy(`(mainCategory->slug.current=="${category}")`)
    }

    query.orderBy('publishedAt')

    return query.build()
  },
}

export interface Asset {
  asset: {
    _ref: string
  }
}

export interface Image {
  url: string
  metadata: {
    lqip: string
    dimensions: {
      width: number
      height: number
    }
  }
}

export interface PostTeaser {
  _id: string
  _type: PostType
  publishedAt: string
  updatedAt: string
  slug: string
  excerpt: string
  title: string
  image?: Image
  imageCaption?: string
  category: Category
  isPartner?: boolean
  seo?: {
    keywords: string
    synonyms: string
  }
  author: {
    title: string
    avatar: Image
  }
  sources?: {
    title: string
    url: string
    logo?: Image
  }
  hero?: HeroType
}

export interface HeroType {
  photo: Asset
  name: string
  aboutMe?: string
  career?: string
  facebook?: string
  instagram?: string
  telegram?: string
  twitter?: string
}

export interface Post extends PostTeaser {
  bodyContent: any[]
  editor: string
  isContentEnabled: boolean
}

export const usePosts = (type: PostType, category?: string) => {
  const { locale } = useRouter()
  const { data, size, setSize } = useSWRInfinite<PostTeaser[]>((index, prevData) => {
    if (prevData && !prevData.length) return null
    return queries.getMany(locale!, type, index * PAGE_SIZE, (index + 1) * PAGE_SIZE - 1, category)
  }, fetcher)

  const posts = data?.flat()
  const isLoading = size > 0 && data && typeof data[size - 1] === 'undefined'
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = !isLoading && posts && posts?.length < PAGE_SIZE * size
  const nextPage = () => setSize(size + 1)

  return { posts, isLoading, isEmpty, isReachingEnd, nextPage }
}

export default queries
