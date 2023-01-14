import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useScrollLock from './useScrollLock'

const useMobileMenu = (maxWidth: number) => {
  const [isOpen, setOpen] = useState(false)
  const { asPath, locale } = useRouter()
  const { enableScroll, disableScroll } = useScrollLock()

  const open = () => {
    disableScroll()
    setOpen(true)
  };

  const close = () => {
    enableScroll()
    setOpen(false)
  }

  useEffect(close, [asPath, locale])
  
  useEffect(() => {
    const handleResize = () => {
      if(isOpen && window.innerWidth > maxWidth - 1) {
        close()
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen])

  return { isOpen, open, close }
}

export default useMobileMenu