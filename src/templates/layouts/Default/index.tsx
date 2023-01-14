import { useEffect, useRef, Fragment } from 'react'
import { Open_Sans } from '@next/font/google'
import cn from 'classnames'
import SeoConfig from '@/components/SeoConfig'
import { debounce } from '@/utils/helpers'
import Footer from './Footer'
import Sidebar from './Sidebar'
import s from './styles/layout.module.scss'
import CookieManager from '@/templates/common/CookieManager'

const font = Open_Sans({
  subsets: ['cyrillic'],
  variable: '--primary-font',
  display: 'block',
})

interface LayoutProps {
  children: React.ReactNode
}

const DefaultLayout = (props: LayoutProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null!)
  const mainRef = useRef<HTMLDivElement>(null!)

  const { children } = props

  useEffect(() => {
    let lastKnownScrollPosition = window.scrollY
    const handleScroll = () => {
      sidebarRef.current.scrollTop += window.scrollY - lastKnownScrollPosition
      lastKnownScrollPosition = window.scrollY
    }
    const setContentMinHeight = debounce(() => {
      mainRef.current.style.minHeight = `${sidebarRef.current.scrollHeight}px`
    }, 100)

    setContentMinHeight()

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', setContentMinHeight)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', setContentMinHeight)
    }
  }, [])

  return (
    <div className={cn(s.wrapper, font.className)}>
      <SeoConfig />
      <CookieManager />
      <div className={s.centered}>
        <Sidebar ref={sidebarRef} />
        <div className={s.main} ref={mainRef}>
          {children}
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
