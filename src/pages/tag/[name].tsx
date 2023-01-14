import { NextSeo } from 'next-seo'
import { SWRConfig } from 'swr'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useRef, Fragment } from 'react'
import useScrollTrigger from '@/utils/hooks/useScrollTrigger'
import Layout from '@/templates/layouts/Default'
import { button, container, grid, heading } from '@/themes/default'
import { GlobalProvider } from '@/contexts/global'
import buildTagStaticProps from '@/utils/builders/tagStaticProps'
import buildTagStaticPaths from '@/utils/builders/tagStaticPaths'
import queries from '@/api'
import { TagType } from '@/api/common'
import { PostTeaser } from '@/api/posts'
import { NewsLayout } from '@/templates/posts/List/News'
import { useTranslation } from 'next-i18next'
import useInfiniteLoader from '@/utils/hooks/useInfiniteLoader'
import { SWRInfiniteKeyLoader } from 'swr/infinite'

export const PAGE_SIZE = 20

interface PageProps {
  fallback: { [key: string]: any }
  translations?: { [key: string]: any }
  tag: TagType
}

export const Content = ({ getQuery }: { getQuery: SWRInfiniteKeyLoader }) => {

  const buttonRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  const { posts, isLoading, isReachingEnd, nextPage } = useInfiniteLoader<PostTeaser>(
    getQuery,
    PAGE_SIZE
  )

  useScrollTrigger(posts?.length && !isLoading ? buttonRef : null, nextPage)

  if (!posts) return null

  return (
    <Fragment>
      <div className={grid.sticky}>
        <div className={grid.sticky__content}>
          <NewsLayout posts={posts} variant="simple" />
        </div>
      </div>

      {!isReachingEnd && (
        <div className={cn(container.textCentered, container.indentTop)}>
          <button
            ref={buttonRef}
            className={cn(button.primary, button.primary_inverted, button.primary_large)}
            onClick={nextPage}
            disabled={isLoading}
          >
            {t('showMore')}
          </button>
        </div>
      )}
    </Fragment>
  )
}

const TagPage = ({ fallback, translations, tag }: PageProps) => {
  const { locale, query } = useRouter()
  const { name } = query as { name: string }

  const getQuery = (index: number, prevData: any | null) => {
    if (prevData && !prevData.length) return null
    return queries.posts.getByTag(
      locale!,
      'news',
      name,
      index * PAGE_SIZE,
      (index + 1) * PAGE_SIZE - 1
    )
  }

  return (
    <SWRConfig value={{ fallback }}>
      <GlobalProvider value={{ translations, type: 'news' }}>
        <Layout>
          <NextSeo title={tag.name} />
          <div className={container.content}>
            <h1 className={heading.h1}>{tag.name}</h1>
            <Content getQuery={getQuery} />
          </div>
        </Layout>
      </GlobalProvider>
    </SWRConfig>
  )
}

export const getStaticPaths = buildTagStaticPaths('news')

export const getStaticProps = buildTagStaticProps('news', PAGE_SIZE)

export default TagPage
