import { useRouter } from 'next/router'

const useUrl = () => {
  const { locale: currentLocale, defaultLocale } = useRouter()

  const absoluteUrl = (url: string, locale: string = currentLocale!) => {
    let result = process.env.NEXT_PUBLIC_ORIGIN
    if(locale !== defaultLocale) {
      result += `/${locale}`
    }
    return result + url
  }

  return { absoluteUrl }
}


export default useUrl