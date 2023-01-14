import { NextSeo } from 'next-seo'
import { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
import Layout from '@/templates/layouts/Default'
import { container, heading } from '@/themes/default'
import { GlobalProvider } from '@/contexts/global'
import queries from '@/api'
import { TagType } from '@/api/common'
import buildTagStaticPaths from '@/utils/builders/tagStaticPaths'
import buildTagStaticProps from '@/utils/builders/tagStaticProps'
import { Content, PAGE_SIZE } from '@/pages/tag/[name]'

interface PageProps {
  fallback: { [key: string]: any }
  translations?: { [key: string]: any }
  tag: TagType
}

const TagPage = ({ fallback, translations, tag }: PageProps) => {
  const { locale, query } = useRouter()
  const { name } = query as { name: string }

  const getQuery = (index: number, prevData: any | null) => {
    if (prevData && !prevData.length) return null
    return queries.posts.getByTag(locale!, 'interview', name, index * PAGE_SIZE, (index + 1) * PAGE_SIZE - 1)
  }

  return (
    <SWRConfig value={{ fallback }}>
      <GlobalProvider value={{ translations, type: 'interview' }}>
        <Layout>
          <NextSeo
            title={tag.name}
          />
          <div className={container.content}>
            <h1 className={heading.h1}>{tag.name}</h1>
            <Content getQuery={getQuery} />
          </div>
        </Layout>
      </GlobalProvider>
    </SWRConfig>
  )
}

export const getStaticPaths = buildTagStaticPaths('interview')

export const getStaticProps = buildTagStaticProps('interview', PAGE_SIZE)

export default TagPage
