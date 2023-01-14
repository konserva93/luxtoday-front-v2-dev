import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { useCategories } from '@/api/common'
import { GuideTheme } from '@/api/guide'
import { imageBuilder } from '@/api/sanity'
import { useRouter } from 'next/router'
import s from './content.module.scss'
import commonS from '../common/guide.module.scss' 
import { useTranslation } from 'next-i18next'
import { button } from '@/themes/default'

interface ContentProps {
  guideTheme?: GuideTheme
  children?: React.ReactNode
}

const Content = (props: ContentProps) => {
  const { guideTheme, children } = props
  const router = useRouter()
  const { t } = useTranslation()
  const { stage } = router.query
  const categories = useCategories('guide')
  const stageIndex = categories!.findIndex(({ slug }) => slug === stage)
  const variant = (['before', 'after', 'long'] as const)[stageIndex]

  return (
    <div className={s.wrapper}>
      {guideTheme && (
        <div className={cn(s.theme, commonS[variant])}>
          <div className={s.theme__icon}>
            <Image
              src={imageBuilder.image(guideTheme.icon).width(100).height(100).url()}
              width={50}
              height={50}
              alt={guideTheme.title}
            />
          </div>
          <div className={s.theme__title}>
            {t(`stages.${stageIndex}`)}
            <strong>{guideTheme.title}</strong>
          </div>
          <Link href="/guide" className={cn(s.theme__button, button.primary)}>
            {t('allStages')}
          </Link>
        </div>
      )}
      
      <div className={cn(s.content, { [s.content_single]: !guideTheme })}>
        {children}
      </div>
    </div>
  )
}

export default Content
