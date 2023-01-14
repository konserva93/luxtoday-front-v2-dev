import { useEffect } from 'react'

const useOnClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: (event: TouchEvent | MouseEvent) => void,
  disabled: boolean = false
) => {
  useEffect(
    () => {
      if(disabled) return;
      const listener = (event: TouchEvent | MouseEvent) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return
        }
        handler(event)
      }
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)
      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    },
    [ref, handler, disabled]
  )
}

export default useOnClickOutside
