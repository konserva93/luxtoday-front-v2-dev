import cn from 'classnames'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Svg from '@/components/Svg'
import { container } from '@/themes/default'
import { email, telegram, twitter } from '@/constants/contacts'
import s from './styles/layout.module.scss'

const Footer = () => {
  const { t } = useTranslation()
  const { locale } = useRouter()
  return (
    <div className={cn(s.footer, container.content)}>
      <ul className={s.footer__menu}>
        <li>
          <Link href="/about-project">{t('footerMenu.about')}</Link>
        </li>
        <li>
          <a href={`mailto:${email}`}>{t('footerMenu.contact')}</a>
        </li>
        <li>
          <Link href="/privacy-policy">{t('footerMenu.privacyPolicy')}</Link>
        </li>
      </ul>
      <ul className={s.footer__socials}>
        {/* <li>
          <a href="#" target="_blank" rel="nofolow noreferrer">
            <Svg name="facebook" size={24} />
          </a>
        </li> */}
        <li>
          <a href={telegram[locale!]} target="_blank" rel="nofolow noreferrer">
            <Svg name="telegram" size={24} />
          </a>
        </li>
        {/* <li>
          <a href="#" target="_blank" rel="nofolow noreferrer">
            <Svg name="instagram" size={24} />
          </a>
        </li> */}
        {locale === 'en' && (
          <li>
            <a href={twitter[locale!] || '#'} target="_blank" rel="nofolow noreferrer">
              <Svg name="twitter" size={24} />
            </a>
          </li>
        )}
      </ul>
      Luxtoday @ {new Date().getFullYear()}
    </div>
  )
}

export default Footer
