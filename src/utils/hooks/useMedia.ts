import { useEffect, useState } from 'react'

interface UseMediaSettings {
  maxWidth: number
}

const useMedia = ({ maxWidth }: UseMediaSettings) => {
  const [matched, setMatched] = useState(false)
  useEffect(() => {
    const handleResize = () => {
      setMatched(window.innerWidth < maxWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return matched
}

export default useMedia
