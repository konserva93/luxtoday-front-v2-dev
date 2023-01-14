import { NextSeo, ArticleJsonLd } from 'next-seo'
import Image from 'next/image'
import Link from 'next/link'
import cn from 'classnames'
import { useTranslation } from 'next-i18next'
import BodyContent from '@/templates/common/BodyContent'
import PostFooter from '@/templates/common/PostFooter'
import TableOfContents from '@/templates/common/TableOfContents'
import Svg from '@/components/Svg'
import useDate from '@/utils/hooks/useDate'
import useUrl from '@/utils/hooks/useUrl'
import useAlternates from '@/utils/hooks/useAlternates'
import galleryStyles from '@/themes/default/styled/Gallery/gallery.module.scss'
import { container } from '@/themes/default'
import { useGlobalParams } from '@/contexts/global'
import { Post } from '@/api/posts'
import { imageBuilder } from '@/api/sanity'
import s from './post.module.scss'
import { getImageSize, truncate } from '@/utils/helpers'

const FullPost = (post: Post) => {
  const dateFormat = useDate()
  const { t } = useTranslation()
  const { absoluteUrl } = useUrl()
  const { type } = useGlobalParams()
  const alternates = useAlternates()

  if (!post) return null

  const {
    publishedAt,
    category,
    excerpt,
    title,
    bodyContent,
    hero,
    _type,
    image,
    imageCaption,
    sources,
    author,
    editor,
    updatedAt,
    isPartner,
    seo,
    isContentEnabled,
  } = post

  const footerInfo = []

  if (sources) {
    footerInfo.push({
      label: isPartner ? 'partner' : 'readOriginal',
      url: sources.url,
      logo: sources.logo?.url,
      title: sources.title,
    })
  }

  if (!sources && _type !== 'news') {
    footerInfo.push({
      label: 'interviewer',
      avatar: author?.avatar.url,
      title: author?.title,
    })
  }

  // if (hero) {
  //   footerInfo.push({
  //     label: 'hero',
  //     avatar: hero.photo,
  //     title: hero.name,
  //   })
  // }

  if (editor) {
    footerInfo.push({
      label: 'editor',
      title: editor,
    })
  }

  const socials =
    hero && (['facebook', 'telegram', 'instagram', 'twitter'] as const).filter((name) => hero[name])

  const baseUrl = type === 'news' ? '/' : `/${type}`
  const categoryUrl = baseUrl + (baseUrl === '/' ? '' : '/') + category.slug
  const url = absoluteUrl(`${categoryUrl}/${post.slug}`)

  const metatags = []
  if (seo?.keywords) {
    metatags.push({ name: 'keywords', content: seo.keywords })
  }

  const seoTitle = truncate(title + ' — ' + t('seo.siteName'), 62)

  return (
    <div className={container.content}>
      <ArticleJsonLd
        url={url}
        title={title}
        images={image ? [image.url] : []}
        datePublished={publishedAt}
        dateModified={updatedAt}
        authorName={footerInfo[0]?.title}
        description={excerpt}
      />
      <NextSeo
        title={seoTitle}
        titleTemplate="%s"
        description={excerpt}
        additionalMetaTags={metatags}
        canonical={url}
        openGraph={{
          url,
          type: 'article',
          images: image && [{ url: image.url }],
          title: title,
          description: excerpt,
          article: {
            publishedTime: publishedAt,
            section: category.name,
            authors: [footerInfo[0]?.title],
          },
        }}
        languageAlternates={alternates}
      />
      <div className={s.wrapper}>
        <div className={s.info}>
          <Link href={baseUrl}>{t(`menu.${type}`)}</Link>
          <span className={s.info__sep}>•</span>
          <Link href={categoryUrl}>{category.name}</Link>
          <div className={s.info__date}>{dateFormat(publishedAt, 'full')}</div>
        </div>

        <div className={s.title}>
          <h1>{title}</h1>
          {!sources && author && _type === 'news' && (
            <div className={s.label}>
              <span>{t('fromEditors')}</span> {t('author')}: {author.title}
            </div>
          )}
        </div>

        <BodyContent content={bodyContent[0]} />

        {_type === 'news' && image && (
          <div className={cn(s.block, galleryStyles.image)}>
            <Image
              src={image.url}
              {...getImageSize(900, image.metadata.dimensions)}
              alt={title}
              placeholder="blur"
              blurDataURL={image.metadata.lqip}
            />
            {imageCaption ? (
              <div className={galleryStyles.image__caption}>{imageCaption}</div>
            ) : null}
          </div>
        )}

        {hero && (
          <div className={s.hero}>
            <div className={s.hero__image}>
              {image && (
                <Image
                  src={image.url}
                  {...image.metadata.dimensions}
                  alt={title}
                  placeholder="blur"
                  blurDataURL={image.metadata.lqip}
                />
              )}
            </div>

            <div className={s.hero__content}>
              <div className={s.hero__photo}>
                {hero.photo && (
                  <Image
                    src={imageBuilder.image(hero.photo).width(260).height(260).url()}
                    width={130}
                    height={130}
                    alt={hero.name}
                  />
                )}
              </div>
              <div className={s.hero__title}>
                <div className={s.hero__name}>{hero.name}</div>
                <div className={s.hero__career}>{hero.career}</div>
              </div>
              <div className={s.hero__about}>{hero.aboutMe}</div>
              {socials && socials.length > 0 && (
                <div className={s.hero__footer}>
                  {t('mySocials')}:
                  <div className={s.hero__links}>
                    {socials.map((name) => (
                      <a href={hero[name]} key={name} className={s[name]}>
                        <Svg name={name} size={24} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {_type === 'interview' && isContentEnabled && <TableOfContents content={bodyContent} />}
        <BodyContent content={bodyContent.slice(1)} />

        <PostFooter info={footerInfo} />
      </div>
    </div>
  )
}

export default FullPost
