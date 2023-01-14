import { GetStaticPropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { unstable_serialize } from 'swr/infinite'
import queries from '@/api'
import { PostType } from '@/api/posts'
import { fetcher } from '@/api/sanity'

const buildTagStaticProps =
  (type: PostType, perPage: number) => async (ctx: GetStaticPropsContext) => {
    const { locale, locales, params } = ctx
    const { name } = params as { name: string }
    const fallback: { [key: string]: any } = {}

    const categoriesQuery = queries.common.getCategories(type, locale)
    fallback[categoriesQuery] = await fetcher(categoriesQuery)

    const postQuery = queries.posts.getByTag(locale!, type, name, 0, perPage - 1)
    fallback[unstable_serialize(() => postQuery)] = await fetcher(postQuery)

    const tag = await fetcher<any>(
      queries.common.getTag(name, locale!, type === 'news' ? 'tags' : 'interviewTags')
    )

    if (!tag) {
      return { notFound: true }
    }

    const translations = locales!.reduce<{ [key: string]: any }>((acc, curr) => {
      if (curr === locale || !tag[`${curr}_slug`]) return acc
      acc[curr] = { name: tag[`${curr}_slug`] }
      return acc
    }, {})

    return {
      props: {
        ...(await serverSideTranslations(ctx.locale!, ['common'])),
        fallback,
        tag,
        translations,
      },
      revalidate: 60,
    }
  }

export default buildTagStaticProps
