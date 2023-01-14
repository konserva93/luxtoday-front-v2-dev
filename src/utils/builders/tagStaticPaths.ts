import { GetStaticPathsContext } from 'next'
import { PostType } from '@/api/posts'
import QueryBuilder from '@/utils/QueryBuilder'
import { fetcher } from '@/api/sanity'

const buildTagStaticPaths = (type: PostType) => async (ctx: GetStaticPathsContext) => {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return { paths: [], fallback: 'blocking' }
  }
  const query = new QueryBuilder()
    .where('_type', type === 'news' ? 'tags' : 'interviewTags')
    .addField('slug.current', 'slug')
    .addField('lang.language._ref', 'locale')
    .build()

  const tags = await fetcher<{ slug: string; locale: string }[]>(query)
  const paths = tags
    .filter(({ locale }) => ctx.locales?.includes(locale))
    .map(({ slug, locale }) => ({ params: { name: slug }, locale }))

  return { paths, fallback: 'blocking' }
}

export default buildTagStaticPaths