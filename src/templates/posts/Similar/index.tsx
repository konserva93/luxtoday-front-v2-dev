import { useTranslation } from 'next-i18next'
import cn from 'classnames'
import { useRef } from 'react'
import { useRouter } from 'next/router'
import { button, container, grid, visibility } from '@/themes/default'
import EditorsChoise from '@/templates/common/EditorsChoise'
import { useGlobalParams } from '@/contexts/global'
import queries, { PostTeaser } from '@/api/posts'
import useScrollTrigger from '@/utils/hooks/useScrollTrigger'
import useInfiniteLoader from '@/utils/hooks/useInfiniteLoader'
import { NewsLayout } from '../List/News'
import { InterviewLayout } from '../List/Interview'
import s from './similar.module.scss'

const PAGE_SIZE = 6

const SimilarPosts = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { locale, query } = router
  const { type } = useGlobalParams()
  const { category: categorySlug, post: postSlug } = query as { post: string; category: string }

  const getQuery = (index: number, prevData: any | null) => {
    if (prevData && !prevData.length) return null
    return queries.getSimilar(
      locale!,
      type!,
      categorySlug,
      postSlug,
      index * PAGE_SIZE,
      (index + 1) * PAGE_SIZE - 1
    )
  }

  const { posts, isLoading, isReachingEnd, nextPage } = useInfiniteLoader<PostTeaser>(
    getQuery,
    PAGE_SIZE
  )

  useScrollTrigger(posts?.length && !isLoading ? buttonRef : null, nextPage)

  if (!posts?.length) {
    return null
  }

  return (
    <div className={cn(container.content, s.content)}>
      <div className={grid.sticky}>
        <div className={grid.sticky__content}>
          {type === 'news' && <NewsLayout posts={posts} variant="similar" />}
          {type === 'interview' && <InterviewLayout posts={posts} />}

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
        </div>
        <div className={cn(grid.sticky__sidebar, visibility.hideMobile)}>
          <EditorsChoise />
        </div>
      </div>
    </div>
  )
}

export default SimilarPosts
