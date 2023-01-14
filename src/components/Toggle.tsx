import { useState, useEffect } from 'react'
import { animated, useSpring } from 'react-spring'
import useHeight from '@/utils/hooks/useHeight'

interface ToggleProps {
  children: React.ReactNode
  visible: boolean
}

const Toggle = ({ children, visible }: ToggleProps) => {
  const [heightRef, height] = useHeight<HTMLDivElement>()
  const [from, setFrom] = useState<{ opacity: number, height: number}>()

  useEffect(() => {
    if(height === undefined) return
    setFrom({ opacity: visible ? 1 : 0, height: visible ? height : 0 })
  }, [height])

  const animation = useSpring({
    from,
    to: { opacity: visible ? 1 : 0, height: visible ? height : 0 },
  })
  
  const styles = (!from && visible) ? { opacity: 1, height: 'auto' } : {
    ...animation,
    overflow: 'hidden',
  }
  return (
    <animated.div style={styles}>
      <div ref={heightRef}>{children}</div>
    </animated.div>
  )
}

export default Toggle
