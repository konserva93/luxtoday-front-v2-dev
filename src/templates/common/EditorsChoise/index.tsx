import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import { block } from '@/themes/default'
import queries from '@/api/common'
import { fetcher } from '@/api/sanity'
import { guideIcon, interviewIcon } from '@/images/menu'

interface Link {
  _type: 'news' | 'interview' | 'guideArticles'
  title: string
  slug: string
  category?: string
  stage?: string
  theme?: string
}

const EditorsChoise = () => {
  const { t } = useTranslation()
  const { locale } = useRouter()
  const { data } = useSWR<Link[]>(queries.getEditorsChoise(locale!), fetcher)
  if(!data) return null;

  const renderLink = ({ _type, title, slug, category, stage, theme }: Link) => {
    let href
    if(_type === 'news') {
      href = `/${category}/${slug}`
    } else if (_type === 'interview') {
      href = `/interview/${category}/${slug}`
    } else {
      href = `/guide/${stage}/${theme}/${slug}`
    }
    return (
      <li key={slug}>
        <Link href={href}>
          {_type === 'interview' && (
            <div className={block.label}>
              <Image src={interviewIcon} width="18" height="18" alt="" />
              {t('menu.interview')}
            </div>
          )}
          {_type === 'guideArticles' && (
            <div className={block.label}>
              <Image src={guideIcon} width="18" height="18" alt="" />
              {t('menu.guide')}
            </div>
          )}
          {title}
        </Link>
      </li>
    )
  }

  return (
    <div className={block.primary}>
      <div className={block.title}>{t('editorsChoise')}</div>
      <ul>
        {data.map(renderLink)}
      </ul>
    </div>
  )
}

export default EditorsChoise
