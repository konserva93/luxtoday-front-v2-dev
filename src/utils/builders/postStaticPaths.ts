import { GetStaticPathsContext } from 'next'
import { fetcher } from '@/api/sanity'
import QueryBuilder from '@/utils/QueryBuilder'
import { PostType } from '@/api/posts'

interface PathProps {
  _type: string
  category: string
  locale: string
  slug: string
}

const buildPostStaticPaths = (type: PostType) => async (ctx: GetStaticPathsContext) => {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return { paths: [], fallback: 'blocking' }
  }
  const { locales } = ctx
  const query = new QueryBuilder()
    .where('_type', type)
    .addField('mainCategory->slug.current', 'category')
    .addField('slug.current', 'slug')
    .addField('lang._ref', 'locale')
    .build()
  const posts = await fetcher<PathProps[]>(query)
  const paths = posts
    .filter(({ locale, category }) => category && locales?.includes(locale))
    .map(({ category, slug, locale }) => {
      const params: { category: string; post: string; type?: string } = { category, post: slug }
      if (type !== 'news') {
        params.type = type
      }
      return { params, locale }
    })
  return { paths, fallback: 'blocking' }
}

export default buildPostStaticPaths
