import { SWRConfig } from 'swr'
import Layout from '@/templates/layouts/Default'
import FullPost from '@/templates/posts/Full'
import SimilarPosts from '@/templates/posts/Similar'
import { GlobalProvider } from '@/contexts/global'
import buildPostStaticPaths from '@/utils/builders/postStaticPaths'
import buildPostStaticProps from '@/utils/builders/postStaticProps'
import { Post } from '@/api/posts'

interface PostPageProps {
  fallback: { [key: string]: any }
  translations: { [key: string]: any }
  post: Post
}

const InterviewPostPage = ({ fallback, translations, post }: PostPageProps) => {
  return (
    <SWRConfig value={{ fallback }}>
      <GlobalProvider value={{ translations, type: 'interview' }}>
        <Layout>
          <FullPost {...post} />
          <SimilarPosts />
        </Layout>
      </GlobalProvider>
    </SWRConfig>
  )
}

export const getStaticPaths = buildPostStaticPaths('interview')

export const getStaticProps = buildPostStaticProps('interview')

export default InterviewPostPage
