import queries from "@/api"
import { PostType } from "@/api/posts"
import { fetcher } from "@/api/sanity"
import { GetStaticPropsContext } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

const buildPostStaticProps = (type: PostType) => async (ctx: GetStaticPropsContext) => {
  const fallback: { [key: string]: any } = {}
  const { locale, params, locales } = ctx
  const { post: postSlug } = params as { post: string }

  const categoriesQuery = queries.common.getCategories(type, locale)
  if (!categoriesQuery) return { notFound: true }
  fallback[categoriesQuery] = await fetcher(categoriesQuery)

  const editorsChoiseQuery = queries.common.getEditorsChoise(locale!)
  fallback[editorsChoiseQuery] = await fetcher(editorsChoiseQuery)

  const postQuery = queries.posts.getBySlug(locale!, type, postSlug)
  const post = await fetcher<any>(postQuery)

  if (!post) return { notFound: true }

  const translations = locales!.reduce<{ [key: string]: any }>((acc, curr) => {
    if (curr === locale) return acc
    const postTranslation = post[`${curr}_slug`]
    const categoryTranslation = post[`${curr}_category`]
    if (postTranslation && categoryTranslation) {
      acc[curr] = {
        category: categoryTranslation,
        post: postTranslation,
      }
      if(post._type !== 'news') {
        acc[curr].type = post._type
      }
    }
    return acc
  }, {})

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common'])),
      fallback,
      translations,
      post,
    },
    revalidate: 60,
  }
}

export default buildPostStaticProps