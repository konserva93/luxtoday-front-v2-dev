import cn from 'classnames'
import { useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { GetStaticPropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { SWRConfig } from 'swr'
import { SWRInfiniteKeyLoader } from 'swr/infinite'
import { button, container, grid, heading } from '@/themes/default'
import Layout from '@/templates/layouts/Default'
import SearchItem from '@/templates/search/Item'
import queries from '@/api'
import { fetcher } from '@/api/sanity'
import useInfiniteLoader from '@/utils/hooks/useInfiniteLoader'

const PAGE_SIZE = 5

interface PageProps {
  fallback: { [key: string]: any }
}

interface LoadedState {
  guideArticles?: number
  interview?: number
  news?: number
}

type SearchItemType = 'news' | 'guideArticles' | 'interview'

interface SearchGroupProps {
  type: SearchItemType
  setLoaded: (setState: (loaded: LoadedState) => LoadedState) => void
}

const SearchGroup = ({ type, setLoaded }: SearchGroupProps) => {
  const { t } = useTranslation()
  const { query, locale } = useRouter()
  const { text } = query as { text?: string }

  const getQuery = (index: number, prevData: any) => {
    if (!text) return null
    if (prevData && !prevData.length) return null
    return queries.common.search(text, type, index * PAGE_SIZE, (index + 1) * PAGE_SIZE - 1, locale)
  }

  const { posts, isLoading, isEmpty, isReachingEnd, nextPage } = useInfiniteLoader<any>(
    getQuery,
    PAGE_SIZE
  )
  useEffect(() => {
    if (!isLoading && posts) {
      setLoaded((loaded: LoadedState) => ({ ...loaded, [type]: posts?.length }))
    }
  }, [isLoading])

  if (!isLoading && !posts?.length) return null

  const title = {
    guideArticles: 'menu.guide',
    news: 'menu.news',
    interview: 'menu.interview',
  }[type]

  return (
    <div className={container.indentBottom}>
      <div className={heading.h2}>{t(title)}</div>
      <div className={grid.news}>
        {posts?.map((item, i) => (
          <div className={grid.item} key={i}>
            <SearchItem {...item} />
          </div>
        ))}
      </div>
      {!isReachingEnd && (
        <div className={cn(container.textCentered, container.indentTop)}>
          <button
            className={cn(button.primary, button.primary_inverted, button.primary_large)}
            onClick={nextPage}
            disabled={isLoading}
          >
            {t('showMore')}
          </button>
        </div>
      )}
    </div>
  )
}

const Search = ({ fallback }: PageProps) => {
  const { t } = useTranslation()
  const { query, locale } = useRouter()
  const { text } = query as { text?: string }
  const [loaded, setLoaded] = useState<LoadedState>({})

  const types: SearchItemType[] = ['guideArticles', 'news', 'interview']
  const isLoading = types.find((type) => loaded[type] === undefined)
  const hasResult = !isLoading && types.filter((type) => loaded[type]! > 0).length > 0

  return (
    <SWRConfig value={{ fallback }}>
      <NextSeo title={t('search') + (text ? ` «${text}»` : '')} />
      <Layout>
        <div className={container.content}>
          {text && <h1 className={heading.h1}>{t('searchTitle', { text })}</h1>}
          {!isLoading && !hasResult && (
            <div className={container.indentBottom}>{t('notFound')}</div>
          )}
          <div style={{ display: isLoading ? 'none' : undefined }}>
            {types.map((type) => (
              <SearchGroup key={type} type={type} setLoaded={setLoaded} />
            ))}
          </div>
        </div>
      </Layout>
    </SWRConfig>
  )
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const fallback: PageProps['fallback'] = {}

  const categoriesQuery = queries.common.getCategories('guide', locale)!
  fallback[categoriesQuery] = await fetcher(categoriesQuery)

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
      fallback,
    },
  }
}

export default Search
