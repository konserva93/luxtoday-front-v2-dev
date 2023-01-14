import { GetStaticPathsContext } from 'next'
import QueryBuilder from '@/utils/QueryBuilder'
import { fetcher } from '@/api/sanity'

const buildCategoryStaticPaths =
  (type: 'headings' | 'interviewHeadings') => async (ctx: GetStaticPathsContext) => {
    if (process.env.SKIP_BUILD_STATIC_GENERATION) {
      return { paths: [], fallback: 'blocking' }
    }
    const query = new QueryBuilder()
      .where('_type', type)
      .addField('slug.current', 'slug')
      .addField('lang.language._ref', 'locale')
      .build()

    const categories = await fetcher<{ _type: string; slug: string; locale: string }[]>(query)
    const paths = categories
      .filter(({ locale }) => ctx.locales?.includes(locale))
      .map(({ slug, locale }) => {
        const params: { category: string; type?: string } = { category: slug }
        if (type === 'interviewHeadings') {
          params.type = type
        }
        return { params, locale }
      })

    return { paths, fallback: 'blocking' }
  }

export default buildCategoryStaticPaths
