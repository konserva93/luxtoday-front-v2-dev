import { useEffect, useState } from 'react'

function useScrollTrigger(
  ref: React.RefObject<HTMLElement> | null,
  handler: () => void,
  options: IntersectionObserverInit = { rootMargin: '-100px' }
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
  }

  useEffect(() => {
    const node = ref?.current
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || !node) return

    let observer = new IntersectionObserver(updateEntry, options)
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref?.current])

  useEffect(() => {
    if (entry?.isIntersecting) {
      handler()
    }
  }, [entry])
}

export default useScrollTrigger
