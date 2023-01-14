import { MutableRefObject, useEffect, useRef, useState } from 'react'

function useHeight<T extends HTMLElement>(): [MutableRefObject<T>, number | undefined] {
  const ref = useRef<T>(null!)
  const [height, set] = useState<number | undefined>()

  useEffect(() => {
    let prevHeight = height;
    const ro = new ResizeObserver(() => {
      if (ref.current && prevHeight !== ref.current.offsetHeight) {
        prevHeight = ref.current.offsetHeight
        set(ref.current.offsetHeight)
      }
    })
    if (ref.current) {
      set(ref.current.offsetHeight)
      ro.observe(ref.current, {})
    }
    return () => ro.disconnect()
  }, [ref.current])
  
  return [ref, height]
}

export default useHeight
