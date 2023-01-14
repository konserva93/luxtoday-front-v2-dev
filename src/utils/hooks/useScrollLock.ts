import { useRef } from 'react'
import { useRouter } from 'next/router'

const useScrollLock = () => {
  const scrollPosition = useRef(0)
  const lastPath = useRef<string | undefined>()
  const router = useRouter()

  const disableScroll = () => {
    lastPath.current = router.asPath
    scrollPosition.current = window.pageYOffset || -parseInt(document.body.style.top)
    const scrollWidth = (window.innerWidth - document.documentElement.clientWidth)
    document.documentElement.style.setProperty('--scroll-width',  scrollWidth + 'px')
    document.body.style.overflow = 'hidden'
  }

  const enableScroll = () => {
    document.body.style.removeProperty('overflow')
    document.documentElement.style.removeProperty('--scroll-width')
    if(router.asPath === lastPath.current) {
      window.scrollTo(0, scrollPosition.current)
    }
  }

  return { enableScroll, disableScroll } as const
}

export default useScrollLock