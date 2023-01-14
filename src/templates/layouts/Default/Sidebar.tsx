import { Fragment, forwardRef, useState, useEffect } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { animated, useSpring, useTransition } from 'react-spring'
import { breakpoints } from '@/themes/default'
import Dropdown from '@/components/Dropdown'
import Svg from '@/components/Svg'
import InputText from '@/themes/default/styled/InputText'
import useMobileMenu from '@/utils/hooks/useMobileMenu'
import { setCookie } from '@/utils/helpers'
import { useGlobalParams } from '@/contexts/global'
import { telegram, twitter } from '@/constants/contacts'
import Menu from './Menu'
import dropdownStyles from './styles/dropdown.module.scss'
import s from './styles/sidebar.module.scss'

const Sidebar = forwardRef<HTMLDivElement, any>((_, ref) => {
  const { open, close, isOpen } = useMobileMenu(breakpoints.desktop)
  const router = useRouter()
  const globalParams = useGlobalParams()
  const { locale, locales, query, pathname } = router
  const { text } = query as { text?: string }
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState<string>('')

  useEffect(() => {
    if (text) {
      setSearchText(text)
    }
  }, [text])

  const sidebarContentStyles = useSpring({ x: isOpen ? '0' : '-100%' })
  const overlayTransition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 200 },
  })

  const renderLocaleLink = (locale: string, callback?: Function) => {
    let href

    if(globalParams.translations?.rewrite) {
      href = globalParams.translations.rewrite as string
    } else if(globalParams.translations) {
      href = globalParams.translations[locale]
        ? { pathname, query: globalParams.translations[locale] }
        : '/'
    } else {
      href = { pathname, query }
    }

    return (
      <Link
        key={locale}
        locale={locale}
        href={href}
        passHref
        prefetch={false}
        onClick={() => {
          setCookie('NEXT_LOCALE', locale)
          callback?.call(null)
        }}
      >
        {locale}
      </Link>
    )
  }

  const renderDropdown = (closeDropdown: Function) =>
    locales!
      .filter((availableLocale) => locale !== availableLocale)
      .map((availableLocale) => renderLocaleLink(availableLocale, closeDropdown))

  const renderDropdownCaption = () => (
    <Fragment>
      {locale} <Svg name="arrow" size={24} />
    </Fragment>
  )

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push({ pathname: '/search', query: { text: searchText } })
  }

  return (
    <div className={s.wrapper} ref={ref}>
      <div className={s.header}>
        <button className={cn(s.burger, isOpen && s.burger_isOpen)} onClick={isOpen ? close : open}>
          <hr /> <hr /> <hr />
        </button>
        <Link href="/" className={s.logo}>
          <Image src="/images/logo.svg" width="150" height="32" alt="Luxtoday" />
        </Link>
        <Dropdown caption={renderDropdownCaption} styles={dropdownStyles}>
          {renderDropdown}
        </Dropdown>

        <ul className={s.header__contacts}>
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
      </div>
      <animated.div className={s.content} style={sidebarContentStyles}>
        <form onSubmit={handleSearchSubmit} className={s.search}>
          <InputText
            value={searchText}
            onChange={setSearchText}
            mutators={{ clear: () => setSearchText('') }}
            placeholder={t('search')}
            preffix={<Svg name="search" size={12} />}
            styles={{ preffix: s.search__preffix }}
            composeMode="merge"
          />
        </form>
        <Menu />
        <div className={s.footer}>
          <Svg name="earth" size={17} />
          {locales?.map((availableLocale) =>
            locale === availableLocale ? (
              <div key={availableLocale} className={s.activeLocale}>
                {locale}
              </div>
            ) : (
              renderLocaleLink(availableLocale)
            )
          )}
        </div>
      </animated.div>
      {overlayTransition(
        (styles, visible) =>
          visible && <animated.div className={s.overlay} style={styles} onClick={close} />
      )}
    </div>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar
