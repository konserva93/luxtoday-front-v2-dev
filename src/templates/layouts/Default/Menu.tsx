import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { button } from '@/themes/default'
import Svg from '@/components/Svg'
import { telegram, twitter } from '@/constants/contacts'
import { useMenu } from '@/api/common'
import { useGlobalParams } from '@/contexts/global'
import { guideIcon, interviewIcon, newsIcon } from '@/images/menu'
import s from './styles/sidebar.module.scss'

const Menu = () => {
  const router = useRouter()
  const { asPath, locale } = router
  const { t } = useTranslation()
  const menu = useMenu()
  const { type } = useGlobalParams()

  const mainMenu = [
    {
      title: t('menu.news'),
      url: '/',
      icon: newsIcon,
      id: 'news',
    },
    {
      title: t('menu.interview'),
      url: '/interview',
      icon: interviewIcon,
      id: 'interview',
    },
    {
      title: t('menu.guide'),
      url: '/guide',
      icon: guideIcon,
      id: 'guide',
    },
  ]

  const isActive = (url: string) => {
    if (url === '/') return asPath === '/'
    return asPath.indexOf(url) === 0
  }

  return (
    <div className={s.menu}>
      <ul>
        {mainMenu.map(({ title, url, icon, id }) => (
          <li className={s.menu__item} key={url}>
            <Link
              href={url}
              className={cn(s.menu__link, {
                [s.menu__link_active]: id === type,
              })}
            >
              <Image src={icon} width="24" height="24" alt="" />
              {title}
            </Link>
          </li>
        ))}
      </ul>

      <div className={s.menu__sep} />

      <ul className={s.submenu}>
        {menu.map(({ name, href, icon }) => {
          return (
            <li key={href} className={s.menu__item}>
              <Link
                href={href}
                className={cn(s.menu__link, { [s.menu__link_active]: isActive(href) })}
              >
                {icon ? <Image src={icon} width={24} height={24} alt="" /> : <span>#</span>}
                {name}
              </Link>
            </li>
          )
        })}
      </ul>
      
      {menu.length > 0 && <div className={s.menu__sep} />}

      <ul className={s.menu__indent}>
        {telegram[locale!] && (
          <li className={s.menu__button}>
            <a className={cn(button.primary, button.primary_narrow)} href={telegram[locale!]}>
              <Svg name="telegram" size={24} className={button.icon_left} />
              {t('readIn', { name: 'Telegram' })}
            </a>
          </li>
        )}
        {twitter[locale!] && (
          <li className={s.menu__button}>
            <a className={cn(button.primary, button.primary_narrow)} href={twitter[locale!]}>
              <Svg name="twitter" size={24} className={button.icon_left} />
              {t('readIn', { name: 'Twitter' })}
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Menu
