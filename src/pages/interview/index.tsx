import { SWRConfig } from 'swr'
import PostsList from '@/templates/posts/List'
import Layout from '@/templates/layouts/Default'
import { GlobalProvider } from '@/contexts/global'
import buildCategoryStaticProps from '@/utils/builders/categoryStaticProps'

interface PageProps {
  fallback: { [key: string]: any }
  translations: { [key: string]: any } | null
}

const InterviewsPage = ({ fallback, translations }: PageProps) => {
  return (
    <SWRConfig value={{ fallback }}>
      <GlobalProvider value={{ translations, type: 'interview' }}>
        <Layout>
          <PostsList />
        </Layout>
      </GlobalProvider>
    </SWRConfig>
  )
}
export const getStaticProps = buildCategoryStaticProps('interview')

export default InterviewsPage
