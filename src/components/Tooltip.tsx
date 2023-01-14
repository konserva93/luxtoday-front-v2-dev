import { debounce } from '@/utils/helpers'
import useOnClickOutside from '@/utils/hooks/useOnClickOutside'
import cn from 'classnames'
import { useRef, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'

export interface TooltipProps {
  children: React.ReactNode
  text: React.ReactNode
  eventType: 'click' | 'hover'
  styles: {
    wrapper: string
    element: string
    element__text: string
    element__arrow: string
    trigger: string
    trigger_click: string
    trigger_hover: string
  }
}

const Tooltip = ({ children, text, eventType, styles: s }: TooltipProps) => {
  const ref = useRef<HTMLDivElement>(null!)
  const textRef = useRef<HTMLDivElement>(null!)
  const visibleRef = useRef<boolean>(false)

  const [styles, api] = useSpring(() => ({
    display: 'none',
    opacity: 0,
    y: -10,
    config: { duration: 200 },
  }))

  const setTextShift = () => {
    if(!ref.current) return
    const width = 300
    const offset = 10
    let shift = width / 2
    const { left } = ref.current.getBoundingClientRect()
    const center = Math.round(left + ref.current.offsetWidth / 2)
    if (center - width / 2 < offset) {
      shift = center - offset
    }
    if (center + width / 2 > window.innerWidth - offset) {
      shift = width + offset + center - window.innerWidth
    }
    textRef.current.style.marginLeft = `-${shift}px`
  }

  useEffect(() => {
    const debouncedSetTextShift = debounce(setTextShift, 250)
    window.addEventListener('resize', debouncedSetTextShift)
    return () => window.addEventListener('resize', debouncedSetTextShift)
  }, [])

  const show = () => {
    setTextShift()
    api.start({ to: [{ display: 'block' }, { opacity: 1, y: 0 }] })
  }
  const hide = () => api.start({ to: [{ opacity: 0, y: -10 }, { display: 'none' }] })

  useOnClickOutside(ref, hide, eventType === 'hover')

  const onClick = () => {
    visibleRef.current ? hide() : show()
    visibleRef.current = !visibleRef.current
  }

  const handlers = eventType === 'click' ? { onClick } : { onMouseOver: show, onMouseOut: hide }

  return (
    <span className={s.wrapper} ref={ref} {...handlers}>
      <animated.span className={s.element} style={styles}>
        <span className={s.element__text} ref={textRef}>
          {text}
        </span>
        <span className={s.element__arrow} />
      </animated.span>
      <span className={cn(s.trigger, s[`trigger_${eventType}`])}>{children}</span>
    </span>
  )
}

export default Tooltip
