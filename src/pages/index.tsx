import { SWRConfig } from 'swr'
import PostsList from '@/templates/posts/List'
import Layout from '@/templates/layouts/Default'
import { GlobalProvider } from '@/contexts/global'
import buildCategoryStaticProps from '@/utils/builders/categoryStaticProps'

interface PageProps {
  fallback: { [key: string]: any }
}

const IndexPage = ({ fallback }: PageProps) => {
  return (
    <SWRConfig value={{ fallback }}>
      <GlobalProvider value={{ type: 'news' }}>
        <Layout>
          <PostsList />
        </Layout>
      </GlobalProvider>
    </SWRConfig>
  )
}

export const getStaticProps = buildCategoryStaticProps('news')

export default IndexPage
