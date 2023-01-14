import { Fragment } from 'react'
import Image from "next/image"
import Link from 'next/link'
import cn from 'classnames'
import { useTranslation } from 'next-i18next'
import Tooltip from '@/components/Tooltip'
import { GuideTheme } from "@/api/guide"
import { imageBuilder } from '@/api/sanity'
import tooltipStyles from './tooltip.module.scss'
import s from './themeLink.module.scss'

const Title = ({ icon, title }: GuideTheme) => (
  <Fragment>
    <div className={s.icon}>
      <Image
        src={imageBuilder.image(icon).width(30).height(30).url()}
        width={30}
        height={30}
        alt={title}
      />
    </div>
    <div className={s.title}>{title}</div>
  </Fragment>
)

interface ThemeLinkProps {
  stageSlug: string
}

const ThemeLink = ({ stageSlug, ...theme }: ThemeLinkProps & GuideTheme) => {
  const { t } = useTranslation()
  
  if(theme.isHold) {
    return (
      <Tooltip
        text={t('inDevelopment')}
        eventType="hover"
        styles={tooltipStyles}
      >
        <div  className={cn(s.element, s.element_disabled)}>
          <Title {...theme} />
        </div>
      </Tooltip>
    )
  }

  return (
    <Link href={`/guide/${stageSlug}/${theme.slug}`} className={s.element}>
      <Title {...theme} />
    </Link>
  )
}
            
export default ThemeLink