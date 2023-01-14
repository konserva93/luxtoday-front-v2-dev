import { GetStaticPropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { unstable_serialize } from 'swr/infinite'
import queries from '@/api'
import { Category } from '@/api/common'
import { PAGE_SIZE, PostType } from '@/api/posts'
import { fetcher } from '@/api/sanity'

const buildCategoryStaticProps = (type: PostType) => async (ctx: GetStaticPropsContext) => {
  const { locale, params = {}, locales } = ctx
  const { category: categorySlug } = params as { category?: string }
  const fallback: { [key: string]: any } = {}

  const categoriesQuery = queries.common.getCategories(type, locale)
  fallback[categoriesQuery] = await fetcher(categoriesQuery)
  
  const editorsChoiseQuery = queries.common.getEditorsChoise(locale!)
  fallback[editorsChoiseQuery] = await fetcher(editorsChoiseQuery)

  const category = fallback[categoriesQuery].find(({ slug }: Category) => slug === categorySlug)

  if (categorySlug && !category) {
    return { notFound: true }
  }

  const postsQuery = queries.posts.getMany(locale!, type, 0, PAGE_SIZE - 1, categorySlug)
  fallback[unstable_serialize(() => postsQuery)] = await fetcher(postsQuery)

  const translations = !category ? null : locales!.reduce<{ [key: string]: any }>((acc, curr) => {
    if (curr === locale) return acc
    acc[curr] = { category: category[`${curr}_slug`] }
    if (type !== type) acc[curr].type = type
    return acc
  }, {})

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
      fallback,
      translations,
    },
    revalidate: 60,
  }
}

export default buildCategoryStaticProps
