import { useGlobalParams } from '@/contexts/global'
import { useRouter } from 'next/router'
import useUrl from './useUrl'

const useAlternates = () => {
  const { translations } = useGlobalParams()
  const { absoluteUrl } = useUrl()
  const { locales, defaultLocale, asPath, locale, pathname } = useRouter()
  if (!translations || Object.keys(translations).length === 0) {
    return undefined
  }

  return locales!
    .filter((lang) => translations[lang] || lang === defaultLocale)
    .map((lang) => {
      return {
        hrefLang: lang === defaultLocale ? 'x-default' : lang,
        href:
          lang === defaultLocale
            ? absoluteUrl(asPath)
            : absoluteUrl(
                Object.keys(translations['en']).reduce(
                  (url, param) => url.replace(`\[${param}\]`, translations['en'][param]),
                  pathname
                ),
                lang
              ),
      }
    })
}

export default useAlternates
