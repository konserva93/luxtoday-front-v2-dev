import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Custom404() {
  const router = useRouter()

  useEffect(() => {
    if(process.env.NODE_ENV === 'development') return
    router.replace('/')
  }, [])

  return null
}
