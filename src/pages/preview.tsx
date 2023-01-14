import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticPropsContext } from 'next'
import { fetcher, previewClient } from '@/api/sanity'
import QueryBuilder from '@/utils/QueryBuilder'
import Layout from '@/templates/layouts/Default'
import FullPost from '@/templates/posts/Full'
import { GlobalProvider } from '@/contexts/global'
import { Post } from '@/api/posts'
import queries from '@/api'

interface PreviewProps {
  post: Post
}

const Preview = ({ post }: PreviewProps) => {
  return (
    <GlobalProvider value={{ type: post._type }}>
      <Layout>
        <FullPost {...post} />
      </Layout>
    </GlobalProvider>
  )
}

export async function getStaticProps({
  preview = false,
  previewData,
  locale,
}: GetStaticPropsContext<{}, { slug: string }>) {
  if (!preview || !previewData) return { notFound: true }
  const { slug } = previewData

  const query = new QueryBuilder().where('slug.current', slug).addField('_type').fetchOne().build()
  const entry = await previewClient.fetch(query)

  let postQuery: string
  switch (entry._type) {
    case 'interview':
    case 'news':
      postQuery = queries.posts.getBySlug(locale!, entry._type, slug)
      break
    default:
      return { notFound: true }
  }
  const post = await previewClient.fetch(postQuery)
  if (!post) {
    return { notFound: true }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
      post,
    },
  }
}

export default Preview
