import queries, { Category } from '@/api/common'
import { fetcher } from '@/api/sanity'
import GuidePage from '../index'

export async function getStaticPaths() {
  const categories: Category[] = await fetcher(queries.getCategories('guide'))
  
  return {
    paths: categories.map(({ slug, locale }) => ({
      params: { stage: slug }, locale
    })),
    fallback: false,
  }
}

export { getStaticProps } from '../index'

export default GuidePage