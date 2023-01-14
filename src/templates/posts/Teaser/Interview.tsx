import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { PostTeaser } from '@/api/posts'
import { imageBuilder } from '@/api/sanity'
import useDate from '@/utils/hooks/useDate'
import s from './teaser.module.scss'
import { getImageSize } from '@/utils/helpers'

const InterviewTeaser = (props: PostTeaser) => {
  const { title, publishedAt, image, category, hero, slug } = props

  const formatDate = useDate()

  if (!category) {
    console.error(`Missing category for the post: ${slug}`)
  }

  return (
    <Link className={cn(s.medium, s.interview)} href={`/interview/${category?.slug}/${slug}`}>
      {image && (
        <div className={s.image}>
          <Image
            src={imageBuilder.image(image.url).url()}
            {...getImageSize(520, image.metadata.dimensions)}
            alt={title}
            placeholder="blur"
            blurDataURL={image.metadata.lqip}
          />
        </div>
      )}
      {hero && hero.photo && (
        <div className={s.hero}>
          <div className={s.hero__name}>{hero.name}</div>
          <div className={s.hero__career}>{hero.career}</div>
          <div className={s.hero__photo}>
            <Image
              src={imageBuilder.image(hero.photo.asset).width(200).height(200).url()}
              alt={hero.name}
              width="100"
              height="100"
            />
          </div>
        </div>
      )}
      <div className={s.content}>
        <div className={s.date}>{formatDate(publishedAt, 'default')}</div>
        <h2 className={s.title}>{title}</h2>
        <div className={s.category}>
          {category.icon && (
            <Image src={category.icon} width={24} height={24} alt={category.name} />
          )}
          {category.name}
        </div>
      </div>
    </Link>
  )
}

export default InterviewTeaser
