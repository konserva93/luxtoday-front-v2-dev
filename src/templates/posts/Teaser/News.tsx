import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { PostTeaser } from '@/api/posts'
import { getImageSize, truncate } from '@/utils/helpers'
import useDate from '@/utils/hooks/useDate'
import s from './teaser.module.scss'

interface TeaserProps {
  variant: 'large' | 'medium' | 'small'
}

const maxImageWidth = {
  large: 980,
  medium: 520,
  small: 220,
}

const NewsTeaser = (props: TeaserProps & PostTeaser) => {
  const { variant, title, publishedAt, excerpt, image, category, sources, slug } = props
  const { t } = useTranslation()

  const formatDate = useDate()

  if (!category) {
    console.error(`Missing category for the post: ${slug}`)
  }

  return (
    <Link className={s[variant]} href={`/${category?.slug}/${slug}`}>
      {image && (
        <div className={s.image}>
          <Image
            src={image.url}
            {...getImageSize(maxImageWidth[variant], image.metadata.dimensions)}
            sizes={variant === 'small' ? '25vw' : '100vw'}
            alt={title}
            placeholder="blur"
            blurDataURL={image.metadata.lqip}
          />
        </div>
      )}
      <div className={s.content}>
        {variant !== 'small' && <div className={s.category}>{category.name}</div>}
        <h2 className={s.title}>{title}</h2>
        {variant === 'medium' && !image && (
          <div className={s.description}>{truncate(excerpt, title.length > 70 ? 90 : 120)}</div>
        )}
        <div className={s.footer}>
          {!sources && <div className={s.label}>{t('fromEditors')}</div>}
          <div className={s.date}>{formatDate(publishedAt, 'fromNow')}</div>
        </div>
      </div>
    </Link>
  )
}

export default NewsTeaser
