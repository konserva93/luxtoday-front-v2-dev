import { SWRConfig } from 'swr'
import Layout from '@/templates/layouts/Default'
import PostsList from '@/templates/posts/List'
import { GlobalProvider } from '@/contexts/global'
import buildCategoryStaticPaths from '@/utils/builders/categoryStaticPaths'
import buildCategoryStaticProps from '@/utils/builders/categoryStaticProps'

interface PageProps {
  fallback: { [key: string]: any }
  translations?: { [key: string]: any }
}

const NewsCategoryPage = ({ fallback, translations }: PageProps) => {
  return (
    <SWRConfig value={{ fallback }}>
      <GlobalProvider value={{ translations, type: 'news' }}>
        <Layout>
          <PostsList />
        </Layout>
      </GlobalProvider>
    </SWRConfig>
  )
}

export const getStaticPaths = buildCategoryStaticPaths('headings')

export const getStaticProps = buildCategoryStaticProps('news')

export default NewsCategoryPage
