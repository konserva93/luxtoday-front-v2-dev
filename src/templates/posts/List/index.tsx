import type { ParsedUrlQuery } from 'querystring'
import { NextSeo } from 'next-seo'
import { useRef } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { button, container, grid, visibility } from '@/themes/default'
import EditorsChoise from '@/templates/common/EditorsChoise'
import useUrl from '@/utils/hooks/useUrl'
import useAlternates from '@/utils/hooks/useAlternates'
import useScrollTrigger from '@/utils/hooks/useScrollTrigger'
import { PostTeaser, PostType, usePosts } from '@/api/posts'
import { useCategories, Category } from '@/api/common'
import { useGlobalParams } from '@/contexts/global'
import NewsList from './News'
import InterviewList from './Interview'

export interface ListProps {
  posts: PostTeaser[]
  category?: Category
  isReachingEnd?: boolean
}

interface QueryParams extends ParsedUrlQuery {
  category?: string
}

const components = {
  news: NewsList,
  interview: InterviewList,
}

export const List = () => {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()
  const { absoluteUrl } = useUrl()
  const alternates = useAlternates()
  const { type } = useGlobalParams()
  const { query } = router
  const { category } = query as QueryParams
  const { posts, isLoading, isReachingEnd, nextPage, isEmpty } = usePosts(type as PostType, category)
  const categories = useCategories(type)
  const activeCategory = category ? categories?.find(({ slug }) => slug === category) : undefined
  const ListComponent = components[type as PostType]

  useScrollTrigger((posts && !isReachingEnd) ? buttonRef : null, nextPage)

  if (!posts) return null

  return (
    <div className={container.content}>
      <NextSeo
        titleTemplate={activeCategory ? t('seo.template') : '%s'}
        title={activeCategory?.name || t('seo.siteName')}
        openGraph={{
          url: activeCategory && absoluteUrl(`/${type}/${activeCategory.slug}`),
        }}
        languageAlternates={alternates}
      />
      <div className={grid.sticky}>
        <div className={grid.sticky__content}>
          <ListComponent posts={posts} category={activeCategory} isReachingEnd={isReachingEnd} />
          
          {!isEmpty && !isReachingEnd && (
            <div className={container.textCentered}>
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
        </div>
        <div className={cn(grid.sticky__sidebar, grid.sticky__sidebar_offset, visibility.hideMobile)}>
          <EditorsChoise />
        </div>
      </div>
    </div>
  )
}

export default List
