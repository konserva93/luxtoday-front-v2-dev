import { Fragment } from 'react'
import cn from 'classnames'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import { container, grid, heading, visibility } from '@/themes/default'
import useDate from '@/utils/hooks/useDate'
import Teaser from '@/templates/posts/Teaser/News'
import { PostTeaser } from '@/api/posts'
import { ListProps } from '.'
import EditorsChoise from '@/templates/common/EditorsChoise'

interface NewsLayoutProps {
  posts: PostTeaser[]
  variant: 'simple' | 'full' | 'similar'
}

export const NewsLayout = ({ posts, variant }: NewsLayoutProps) => {
  let large, medium, mediumWithImage, small

  switch (variant) {
    case 'simple':
      small = posts
      break
    case 'full':
      large = posts[0]
      medium = posts.slice(1, 3)
      mediumWithImage = posts.slice(3, 5)
      small = posts.slice(5)
      break
    case 'similar':
      medium = posts.slice(0, 2)
      small = posts.slice(2)
      break
  }

  return (
    <div className={cn(grid.single, container.indentBottom)}>
      {large && (
        <div className={grid.item}>
          <Teaser {...large} variant="large" />
        </div>
      )}

      {medium && medium.length > 0 && (
        <div className={cn(grid.tiles, grid.item)}>
          {medium.map((post) => (
            <div
              key={post._id}
              className={cn(grid.item, medium.length === 1 && grid.item__fullwidth)}
            >
              <Teaser {...post} image={undefined} variant="medium" />
            </div>
          ))}
        </div>
      )}

      {variant === 'full' && (
        <div className={cn(grid.item, visibility.hideDesktop)}>
          <EditorsChoise />
        </div>
      )}

      {mediumWithImage && mediumWithImage.length > 0 && (
        <div className={cn(grid.tiles, grid.item)}>
          {mediumWithImage.map((post) => (
            <div className={grid.item} key={post._id}>
              <Teaser {...post} variant="medium" />
            </div>
          ))}
        </div>
      )}

      {small && small.length > 0 && (
        <div className={cn(grid.news, grid.item)}>
          {small.map((post) => (
            <Teaser key={post._id} {...post} variant="small" />
          ))}
        </div>
      )}
    </div>
  )
}

const NewsList = (props: ListProps) => {
  const { posts, category } = props
  const dateFormat = useDate()
  const { t } = useTranslation()

  if (category) {
    return (
      <Fragment>
        <div className={heading.h1}><b>#</b>{category.name}</div>
        <NewsLayout variant="full" posts={posts} />
      </Fragment>
    )
  }

  const postsByDate = posts?.reduce<{ [key: string]: PostTeaser[] }>((acc, post) => {
    const date = post.publishedAt.split('T')[0] + 'T00:00:00+01:00'
    return {
      ...acc,
      [date]: [...(acc[date] || []), post],
    }
  }, {})

  const dates = Object.keys(postsByDate)

  return (
    <Fragment>
      {dates.map((date, groupIndex) => (
        <Fragment key={date}>
          <div className={heading.h1}>
            {moment().format('YYYY-MM-DD') === date ? (
              <Fragment>
                <b>#</b>{t('today')}
              </Fragment>
            ) : (
              dateFormat(date, 'day')
            )}
          </div>
          <NewsLayout variant={groupIndex === 0 ? 'full' : 'simple'} posts={postsByDate[date]} />
        </Fragment>
      ))}
    </Fragment>
  )
}

export default NewsList
