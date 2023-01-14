import { Fragment } from 'react'
import Image from 'next/image'
import cn from 'classnames'
import { useTranslation } from 'next-i18next'
import { button, container, grid, heading, visibility } from '@/themes/default'
import Teaser from '@/templates/posts/Teaser/Interview'
import { PostTeaser } from '@/api/posts'
import { ListProps } from '.'
import EditorsChoise from '@/templates/common/EditorsChoise'
import classNames from 'classnames'

interface InterviewLayoutProps {
  posts: PostTeaser[]
}

export const InterviewLayout = ({ posts }: InterviewLayoutProps) => {
  return (
    <div className={cn(grid.tiles, container.indentBottom)}>
      {posts.slice(0, 2).map((post: PostTeaser) => (
        <div className={grid.item} key={post._id}>
          <Teaser {...post} />
        </div>
      ))}
      <div className={classNames(grid.item, grid.item__fullwidth, visibility.hideDesktop)}>
        <EditorsChoise />
      </div>
      {posts.slice(2).map((post: PostTeaser) => (
        <div className={grid.item} key={post._id}>
          <Teaser {...post} />
        </div>
      ))}
    </div>
  )
}

const InterviewList = (props: ListProps) => {
  const { posts, category } = props
  const { t } = useTranslation()

  return (
    <Fragment>
      <div className={heading.h1}>
        {category ? (
          <Fragment>
            {category.icon && (
              <Image src={category.icon} width={36} height={36} alt={category.name} />
            )}
            {category.name}
          </Fragment>
        ) : (
          t('menu.interview')
        )}
      </div>
      <InterviewLayout posts={posts} />
    </Fragment>
  )
}

export default InterviewList
