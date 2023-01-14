import Image from 'next/image'
import Link from 'next/link'
import useDate from '@/utils/hooks/useDate'
import { SearchItem } from '@/api/common'
import s from '@/templates/posts/Teaser/teaser.module.scss'
import cn from 'classnames'
import { getImageSize } from '@/utils/helpers'

const SearchItem = (props: SearchItem) => {
  const { _type, title, publishedAt, category, slug, stage, theme, stageTitle } = props
  const image = props.image || props.stageImage
  const dateFormat = useDate()

  const getHref = () => {
    switch (_type) {
      case 'guideArticles':
        return `/guide/${stage}/${theme}/${slug}`
      case 'news':
        return `/${category}/${slug}`
      default:
        return `/${_type}/${category}/${slug}`
    }
  }

  return (
    <Link className={s.small} href={getHref()}>
      {image && (
        <div className={cn(s.image, _type === 'guideArticles' && s.image_icon)}>
          <Image
            src={image.url}
            {...getImageSize(220, image.metadata.dimensions)}
            sizes={'25vw'}
            alt=""
            placeholder="blur"
            blurDataURL={image.metadata.lqip}
          />
        </div>
      )}
      <div className={s.content}>
        {_type === 'guideArticles' && <div className={s.category}>{stageTitle}</div>}
        <h2 className={s.title}>{title}</h2>
        {_type !== 'guideArticles' && <div className={s.date}>{dateFormat(publishedAt)}</div>}
      </div>
    </Link>
  )
}

export default SearchItem
