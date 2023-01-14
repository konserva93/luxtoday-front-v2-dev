import { NextSeo } from 'next-seo'
import cn from 'classnames'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Article as ArticlyType, GuideTheme } from '@/api/guide'
import BodyContent from '@/templates/common/BodyContent'
import PostFooter from '@/templates/common/PostFooter'
import TableOfContents from '@/templates/common/TableOfContents'
import { button, heading } from '@/themes/default'
import useDate from '@/utils/hooks/useDate'
import useAlternates from '@/utils/hooks/useAlternates'
import s from './article.module.scss'

interface ArticleProps extends ArticlyType {
  theme: GuideTheme
}

const Article = (props: ArticleProps) => {
  const { title, bodyContent, sources, nextArticle, theme, date } = props
  const router = useRouter()
  const { t } = useTranslation()
  const dateFormat = useDate()
  const alternates = useAlternates()

  const { stage, theme: themeSlug } = router.query as { stage: string; theme: string }

  const links = sources
    .split('\r\n')
    .map((url) => {
      try {
        const { host } = new URL(url)
        return (
          <a href={url} rel="nofollow noreferrer" key={url}>
            {host}
          </a>
        )
      } catch (e) {}
    })
    .filter((url) => url)
    .reduce<(React.ReactNode | string)[]>(
      (acc, link) => [...acc, acc.length ? '\u00a0| ' : null, link],
      []
    )

  return (
    <div className={s.wrapper}>
      <NextSeo languageAlternates={alternates} />
      <div className={s.parent}>
        <Link href={`/guide/${stage}/${themeSlug}`}>{theme.title}</Link>
        {'\u00a0/'}
      </div>
      <h1 className={cn(heading.h1, s.title)}>{title}</h1>
      <div className={s.date}>
        {t('updateAt')}: {dateFormat(date)}
      </div>
      <TableOfContents content={bodyContent} />
      <div className={s.content}>
        <BodyContent content={bodyContent} />
      </div>
      {nextArticle && (
        <Link href={`/guide/${stage}/${themeSlug}/${nextArticle}`} className={button.primary}>
          {t('nextArticle')}
        </Link>
      )}

      <PostFooter info={[{ label: 'source', content: <div className={s.links}>{links}</div> }]} />
    </div>
  )
}

export default Article
