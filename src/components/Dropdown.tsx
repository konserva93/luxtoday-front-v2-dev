import { useEffect, useRef, useState } from 'react'
import { useTransition, animated } from 'react-spring'
import cn from 'classnames'
import useOnClickOutside from '@/utils/hooks/useOnClickOutside'

type RenderFunction = (close: Function, isOpen?: boolean) => React.ReactNode

interface DropdownProps {
  caption: React.ReactNode | RenderFunction
  children: React.ReactElement | RenderFunction
  styles: {
    wrapper: string
    caption: string
    content: string
    isOpen?: string
  }
}

const Dropdown = (props: DropdownProps) => {
  const { caption, children, styles: s } = props
  const ref = useRef<HTMLDivElement>(null)
  const [isOpen, setOpen] = useState(false)
  const open = () => setOpen(true)
  const close = () => setOpen(false)
  useOnClickOutside(ref, close)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const dropdownTransition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 200 },
  })

  const handleCaptionClick = () => (isOpen ? close() : open())

  return (
    <div className={cn(s.wrapper, isOpen && s.isOpen)} ref={ref}>
      <div className={s.caption} onClick={handleCaptionClick}>
      {typeof caption === 'function' ? caption(close, isOpen) : caption}
      </div>
      {dropdownTransition(
        (styles, visible) =>
          visible && (
            <animated.div className={s.content} style={styles}>
              {typeof children === 'function' ? children(close, isOpen) : children}
            </animated.div>
          )
      )}
    </div>
  )
}

export default Dropdown
