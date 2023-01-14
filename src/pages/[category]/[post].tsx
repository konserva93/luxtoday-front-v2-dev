import { SWRConfig } from 'swr'
import Layout from '@/templates/layouts/Default'
import FullPost from '@/templates/posts/Full'
import { GlobalProvider } from '@/contexts/global'
import buildPostStaticPaths from '@/utils/builders/postStaticPaths'
import SimilarPosts from '@/templates/posts/Similar'
import buildPostStaticProps from '@/utils/builders/postStaticProps'
import { Post } from '@/api/posts'

interface PostPageProps {
  fallback: { [key: string]: any }
  translations: { [key: string]: any }
  post: Post
}

const NewsPostPage = ({ fallback, translations, post }: PostPageProps) => {
  return (
    <SWRConfig value={{ fallback }}>
      <GlobalProvider value={{ translations, type: 'news' }}>
        <Layout>
          <FullPost {...post} />
          <SimilarPosts />
        </Layout>
      </GlobalProvider>
    </SWRConfig>
  )
}

export const getStaticPaths = buildPostStaticPaths('news')

export const getStaticProps = buildPostStaticProps('news')

export default NewsPostPage
