import { Fragment } from 'react'
import cn from 'classnames'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { button } from '@/themes/default'
import Toggle from '@/components/Toggle'
import type { GuideThemeGroup } from '@/api/guide'
import { imageBuilder } from '@/api/sanity'
import commonS from '../common/guide.module.scss'
import ThemeLink from '../common/ThemeLink'
import s from './stage.module.scss'

interface StageProps extends GuideThemeGroup {
  variant: 'before' | 'after' | 'long'
  subtitle: string
  clickHandler: () => void
  isActive: boolean
}

const Stage = (props: StageProps) => {
  const { t } = useTranslation()
  const { variant, name, subtitle, description, icon, clickHandler, isActive, themes, slug } = props

  return (
    <Fragment>
      <div className={cn(s.wrapper, commonS[variant])}>
        <div className={s.icon}>
          <Image
            src={imageBuilder.image(icon!).width(280).url()}
            width={140}
            height={140}
            alt={name}
          />
        </div>
        <div className={s.subTitle}>{subtitle}</div>
        <div className={s.title}>{name}</div>
        <div className={s.description}>{description}</div>
        <button className={cn(button.primary, button.primary_large)} onClick={clickHandler}>
          {t('whatIncluded')}
        </button>
      </div>

      <Toggle visible={isActive}>
        <div className={s.themes}>
          {themes.map((theme) => (
            <div className={s.theme} key={theme.slug}>
              <ThemeLink stageSlug={slug} {...theme} />
            </div>
          ))}
        </div>
      </Toggle>
    </Fragment>
  )
}

export default Stage
